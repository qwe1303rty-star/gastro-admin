import { PUSH_SERVER_URL, VAPID_PUBLIC_KEY } from '../config'

const LS_KEY = 'gs_push_subscribed'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = base64String.replace(/-/g, '+').replace(/_/g, '/') + padding
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

export function isIOS() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

export function isPushSupported() {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

export function isPushReady() {
  if (!isPushSupported()) return false
  if (isIOS() && !isStandalone()) return false
  return true
}

function setSubscribed(value) {
  if (value) {
    localStorage.setItem(LS_KEY, 'true')
  } else {
    localStorage.removeItem(LS_KEY)
  }
}

export async function subscribeToPush() {
  if (!isPushReady()) {
    throw new Error(
      isIOS()
        ? 'Установите приложение на домашний экран'
        : 'Push не поддерживается'
    )
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    throw new Error('Разрешение не получено')
  }

  const registration = await navigator.serviceWorker.ready

  const existing = await registration.pushManager.getSubscription()
  if (existing) {
    setSubscribed(true)
    return existing
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  })

  const subJson = subscription.toJSON()

  const response = await fetch(`${PUSH_SERVER_URL}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subJson),
  })

  if (!response.ok) {
    throw new Error('Ошибка регистрации на сервере')
  }

  setSubscribed(true)
  return subscription
}

export async function unsubscribeFromPush() {
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()

  if (subscription) {
    await fetch(`${PUSH_SERVER_URL}/unsubscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    }).catch(() => {})

    await subscription.unsubscribe()
  }

  setSubscribed(false)
}

export async function isSubscribed() {
  if (localStorage.getItem(LS_KEY) === 'true') {
    return true
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      setSubscribed(true)
      return true
    }
  } catch {}

  setSubscribed(false)
  return false
}
