import { AnimatePresence } from 'framer-motion'
import { AppProvider, useApp } from './lib/context'
import { PhoneShell } from './components/PhoneShell'
import { BottomNav } from './components/BottomNav'
import { PushToast } from './components/PushToast'
import { Splash } from './screens/Splash'
import { Login } from './screens/Login'
import { Dashboard } from './screens/Dashboard'
import { Orders } from './screens/Orders'
import { OrderDetail } from './screens/OrderDetail'
import { Stats } from './screens/Stats'
import { Notifications } from './screens/Notifications'
import { Settings } from './screens/Settings'

function AppContent() {
  const {
    phase, setPhase, tab, navigate, activeOrderId, openOrder, closeOrder,
    orders, notifications, unread, toast, dismissToast,
    isAuth, login, settings, updateSettings,
    advanceOrder, updateOrderStatus,
    markAllRead, simulateNewOrder, doRefresh, refreshToken,
  } = useApp()

  if (!isAuth && phase !== 'auth' && phase !== 'splash') {
    setTimeout(() => setPhase('auth'), 0)
  }

  const handleLogin = (pin) => login(pin)
  const handleSplashDone = () => setPhase(isAuth ? 'app' : 'auth')

  const screenKey = activeOrderId || tab

  return (
    <PhoneShell>
      <AnimatePresence mode="wait">
        {phase === 'splash' && <Splash key="splash" onDone={handleSplashDone} />}

        {phase === 'auth' && (
          <Login key="login" onLogin={handleLogin} />
        )}

        {phase === 'app' && (
          <>
            {tab === 'home' && !activeOrderId && (
              <Dashboard key="dashboard" orders={orders} navigate={navigate} openOrder={openOrder} unread={unread} doRefresh={doRefresh} refreshToken={refreshToken} />
            )}
            {tab === 'orders' && !activeOrderId && (
              <Orders key="orders" orders={orders} openOrder={openOrder} doRefresh={doRefresh} refreshToken={refreshToken} />
            )}
            {activeOrderId && (
              <OrderDetail key="order-detail" orders={orders} activeOrderId={activeOrderId} closeOrder={closeOrder} advanceOrder={advanceOrder} updateOrderStatus={updateOrderStatus} />
            )}
            {tab === 'stats' && !activeOrderId && (
              <Stats key="stats" orders={orders} doRefresh={doRefresh} />
            )}
            {tab === 'notifications' && !activeOrderId && (
              <Notifications key="notifications" notifications={notifications} markAllRead={markAllRead} openOrder={openOrder} unread={unread} />
            )}
            {tab === 'settings' && !activeOrderId && (
              <Settings key="settings" settings={settings} updateSettings={updateSettings} simulateNewOrder={simulateNewOrder} logout={() => { setPhase('auth') }} />
            )}
          </>
        )}
      </AnimatePresence>

      {phase === 'app' && !activeOrderId && (
        <BottomNav tab={tab} navigate={navigate} unread={unread} />
      )}

      <PushToast toast={toast} onDismiss={dismissToast} onOpenOrder={openOrder} />
    </PhoneShell>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
