const VAPID_PUBLIC_KEY = 'BIID9UzSXpFwJ4OlJOacVcNg3c66sHARBysgsHUtkvh-xNKRDj-QokZ5_Z9TafWBnsZB99hLQfTVGfPckySfj4Q'
const VAPID_PRIVATE_KEY = 'E8IutWKtMMQcJPMVHwQzHLRk5RE05TSmsmjS1VGMoGI'
const VAPID_SUBJECT = 'mailto:admin@gastro-spektakl.ru'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  })
}

function base64UrlToUint8Array(base64Url) {
  const padding = '='.repeat((4 - (base64Url.length % 4)) % 4)
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/') + padding
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function uint8ArrayToBase64Url(arr) {
  let binary = ''
  for (let i = 0; i < arr.length; i++) binary += String.fromCharCode(arr[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function generateVapidJws(audience) {
  const header = { typ: 'JWT', alg: 'ES256' }
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    aud: audience,
    exp: now + 43200,
    sub: VAPID_SUBJECT,
  }

  const encoder = new TextEncoder()
  const headerB64 = uint8ArrayToBase64Url(encoder.encode(JSON.stringify(header)))
  const payloadB64 = uint8ArrayToBase64Url(encoder.encode(JSON.stringify(payload)))
  const signingInput = `${headerB64}.${payloadB64}`

  const keyData = base64UrlToUint8Array(VAPID_PRIVATE_KEY)
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    cryptoKey,
    encoder.encode(signingInput)
  )

  const sigB64 = uint8ArrayToBase64Url(new Uint8Array(signature))
  return `${signingInput}.${sigB64}`
}

async function encryptPayload(payload, subscription) {
  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify(payload))

  const auth = base64UrlToUint8Array(subscription.keys.auth)
  const p256dh = base64UrlToUint8Array(subscription.keys.p256dh)

  const ephemeralKey = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveBits']
  )

  const serverPublicKey = await crypto.subtle.exportKey('raw', ephemeralKey.publicKey)

  const recipientKey = await crypto.subtle.importKey(
    'raw',
    p256dh,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  )

  const sharedSecret = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: recipientKey },
    ephemeralKey.privateKey,
    256
  )

  const salt = crypto.getRandomValues(new Uint8Array(16))

  const authInfo = encoder.encode('WebPush: info\x00')
  const clientInfo = new Uint8Array(authInfo.length + 2 + p256dh.length + 2)
  clientInfo.set(authInfo)
  clientInfo[authInfo.length] = p256dh.length >> 8
  clientInfo[authInfo.length + 1] = p256dh.length & 0xff
  clientInfo.set(p256dh, authInfo.length + 2)
  clientInfo[authInfo.length + 2 + p256dh.length] = serverPublicKey.byteLength >> 8
  clientInfo[authInfo.length + 2 + p256dh.length + 1] = serverPublicKey.byteLength & 0xff
  clientInfo.set(new Uint8Array(serverPublicKey), authInfo.length + 2 + p256dh.length + 2)

  const ikm = await hmacSha256(sharedSecret, salt, encoder.encode('WebPush: info\x00'))
  const keyInfo = encoder.encode('Content-Encoding: aes128gcm\x00')
  const prk = await hmacSha256(auth, ikm, null)
  const keyMaterial = await hmacSha256(prk, salt, keyInfo)

  const key = await crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'AES-GCM', length: 128 },
    false,
    ['encrypt']
  )

  const nonce = await hmacSha256(
    await hmacSha256(prk, salt, encoder.encode('Content-Encoding: nonce\x00')),
    new Uint8Array(0),
    null
  )

  const iv = nonce.slice(0, 12)
  const record = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data)

  const recordBytes = new Uint8Array(record)
  const tag = recordBytes.slice(-16)
  const ciphertext = recordBytes.slice(0, -16)

  const keyId = new Uint8Array([0x04, ...new Uint8Array(serverPublicKey)])
  const rs = new Uint8Array([data.byteLength + 1])
  const header = new Uint8Array([0x01, rs[0], 0x00, keyId.length])
  const result = new Uint8Array(header.length + keyId.length + ciphertext.length + tag.length)
  result.set(header)
  result.set(keyId, header.length)
  result.set(ciphertext, header.length + keyId.length)
  result.set(tag, header.length + keyId.length + ciphertext.length)

  return result
}

async function hmacSha256(key, data1, data2) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key instanceof Uint8Array ? key : new Uint8Array(0),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const combined = new Uint8Array(data1.length + (data2 ? data2.length : 0))
  combined.set(data1)
  if (data2) combined.set(data2, data1.length)

  const sig = await crypto.subtle.sign('HMAC', cryptoKey, combined)
  return new Uint8Array(sig)
}

async function sendPush(subscription, payload) {
  const endpoint = subscription.endpoint
  const audience = new URL(endpoint).origin

  const jws = await generateVapidJws(audience)
  const encrypted = await encryptPayload(payload, subscription)

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Encoding': 'aes128gcm',
      'Content-Type': 'application/octet-stream',
      Authorization: `vapid t=${jws}, k=${VAPID_PUBLIC_KEY}`,
    },
    body: encrypted,
  })

  return response.status
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    const url = new URL(request.url)
    const path = url.pathname

    try {
      if (path === '/subscribe' && request.method === 'POST') {
        const body = await request.json()
        const endpoint = body.endpoint

        if (!endpoint) return json({ error: 'Missing endpoint' }, 400)

        await env.SUBSCRIPTIONS.put(endpoint, JSON.stringify(body), {
          expirationTtl: 7776000,
        })

        return json({ status: 'ok' })
      }

      if (path === '/unsubscribe' && request.method === 'POST') {
        const body = await request.json()
        const endpoint = body.endpoint

        if (!endpoint) return json({ error: 'Missing endpoint' }, 400)

        await env.SUBSCRIPTIONS.delete(endpoint)
        return json({ status: 'ok' })
      }

      if (path === '/send' && request.method === 'POST') {
        const body = await request.json()
        const { title, body: msgBody, tag, url } = body

        const keys = await env.SUBSCRIPTIONS.list()
        const results = { sent: 0, failed: 0 }

        const payload = {
          title: title || 'ГС Заказы',
          body: msgBody || 'Новое уведомление',
          tag: tag || 'gs-order',
          url: url || '/gastro-admin/',
        }

        const batchSize = 10
        for (let i = 0; i < keys.keys.length; i += batchSize) {
          const batch = keys.keys.slice(i, i + batchSize)
          const promises = batch.map(async (key) => {
            try {
              const sub = JSON.parse(await env.SUBSCRIPTIONS.get(key.name))
              const status = await sendPush(sub, payload)
              if (status >= 200 && status < 300) {
                results.sent++
              } else if (status === 404 || status === 410) {
                await env.SUBSCRIPTIONS.delete(key.name)
                results.failed++
              } else {
                results.failed++
              }
            } catch {
              results.failed++
              try { await env.SUBSCRIPTIONS.delete(key.name) } catch {}
            }
          })
          await Promise.all(promises)
        }

        return json(results)
      }

      if (path === '/vapidPublicKey' && request.method === 'GET') {
        return json({ publicKey: VAPID_PUBLIC_KEY })
      }

      return json({ error: 'Not found' }, 404)
    } catch (err) {
      return json({ error: err.message }, 500)
    }
  },
}
