const VAPID_PUBLIC_KEY = 'BIID9UzSXpFwJ4OlJOacVcNg3c66sHARBysgsHUtkvh-xNKRDj-QokZ5_Z9TafWBnsZB99hLQfTVGfPckySfj4Q'

const VAPID_PRIVATE_KEY_PKCS8_B64URL = 'MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgE8IutWKtMMQcJPMVHwQzHLRk5RE05TSmsmjS1VGMoGKhRANCAASCA_VM0l6RcCeDpSTmnFXDYN3OurBwEQcrILB1LZL4fsTSkQ4_kKJGef2fU2n1gZ7GQffYS0H01Rnz3JMkn4-E'

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

function concat(...arrays) {
  let totalLength = 0
  for (const arr of arrays) totalLength += arr.length
  const result = new Uint8Array(totalLength)
  let offset = 0
  for (const arr of arrays) {
    result.set(arr, offset)
    offset += arr.length
  }
  return result
}

async function hmacSha256(key, data) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  return new Uint8Array(await crypto.subtle.sign('HMAC', cryptoKey, data))
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

  const keyData = base64UrlToUint8Array(VAPID_PRIVATE_KEY_PKCS8_B64URL)
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

  const authSecret = base64UrlToUint8Array(subscription.keys.auth)
  const uaPublicKey = base64UrlToUint8Array(subscription.keys.p256dh)

  const asKeyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    ['deriveBits']
  )
  const asPublicKey = new Uint8Array(await crypto.subtle.exportKey('raw', asKeyPair.publicKey))

  const uaCryptoKey = await crypto.subtle.importKey(
    'raw',
    uaPublicKey,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  )

  const ecdhSecret = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: uaCryptoKey },
    asKeyPair.privateKey,
    256
  )

  const prkKey = await hmacSha256(authSecret, new Uint8Array(ecdhSecret))

  const keyInfo = concat(
    encoder.encode('WebPush: info\x00'),
    uaPublicKey,
    asPublicKey
  )
  const ikmFull = await hmacSha256(prkKey, concat(keyInfo, new Uint8Array([0x01])))
  const ikm = ikmFull.slice(0, 32)

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const prk = await hmacSha256(salt, ikm)

  const cekInfo = concat(encoder.encode('Content-Encoding: aes128gcm\x00'))
  const cekFull = await hmacSha256(prk, concat(cekInfo, new Uint8Array([0x01])))
  const cek = cekFull.slice(0, 16)

  const nonceInfo = concat(encoder.encode('Content-Encoding: nonce\x00'))
  const nonceFull = await hmacSha256(prk, concat(nonceInfo, new Uint8Array([0x01])))
  const nonce = nonceFull.slice(0, 12)

  const cekCryptoKey = await crypto.subtle.importKey(
    'raw',
    cek,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  )

  const plaintext = concat(new Uint8Array([0x02]), data)
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: nonce, tagLength: 128 },
      cekCryptoKey,
      plaintext
    )
  )

  const rs = new Uint8Array(4)
  new DataView(rs.buffer).setUint32(0, 4096)

  const header = concat(
    salt,
    rs,
    new Uint8Array([0x41]),
    asPublicKey
  )

  return concat(header, ciphertext)
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
      TTL: '86400',
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

        const pushPayload = {
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
              const status = await sendPush(sub, pushPayload)
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

      if (path === '/debug' && request.method === 'GET') {
        const keys = await env.SUBSCRIPTIONS.list()
        const subs = []
        for (const key of keys.keys) {
          const val = await env.SUBSCRIPTIONS.get(key.name)
          const parsed = JSON.parse(val)
          subs.push({ endpoint: parsed.endpoint?.substring(0, 50) + '...', hasKeys: !!parsed.keys })
        }
        return json({ count: subs.length, subs })
      }

      if (path === '/send-debug' && request.method === 'POST') {
        const body = await request.json()
        const keys = await env.SUBSCRIPTIONS.list()
        const results = []

        for (const key of keys.keys) {
          try {
            const sub = JSON.parse(await env.SUBSCRIPTIONS.get(key.name))
            const jws = await generateVapidJws(new URL(sub.endpoint).origin)
            const encrypted = await encryptPayload({ title: 'Test', body: 'Test' }, sub)
            const response = await fetch(sub.endpoint, {
              method: 'POST',
              headers: {
                'Content-Encoding': 'aes128gcm',
                'Content-Type': 'application/octet-stream',
                Authorization: `vapid t=${jws}, k=${VAPID_PUBLIC_KEY}`,
              },
              body: encrypted,
            })
            const text = await response.text()
            results.push({ endpoint: sub.endpoint?.substring(0, 60), status: response.status, body: text })
          } catch (err) {
            results.push({ error: err.message })
          }
        }

        return json({ count: keys.keys.length, results })
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
