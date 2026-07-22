import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginScreen from './components/LoginScreen'
import TabBar from './components/TabBar'
import DashboardPage from './pages/DashboardPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import StatsPage from './pages/StatsPage'
import NotificationsPage from './pages/NotificationsPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'

function AppContent() {
  const { isAuth } = useAuth()
  const [page, setPage] = useState('home')
  const [orderId, setOrderId] = useState(null)

  if (!isAuth) return <LoginScreen />

  const navigate = (target, id) => {
    if (target === 'order' && id) {
      setOrderId(id)
      setPage('order')
    } else {
      setOrderId(null)
      setPage(target)
    }
  }

  const goBack = () => {
    setOrderId(null)
    setPage('home')
  }

  const showTabBar = !['order', 'profile'].includes(page)

  let content
  switch (page) {
    case 'home':
      content = <DashboardPage onNavigate={navigate}/>
      break
    case 'orders':
      content = <OrdersPage onNavigate={navigate}/>
      break
    case 'order':
      content = <OrderDetailPage orderId={orderId} onBack={goBack}/>
      break
    case 'stats':
      content = <StatsPage/>
      break
    case 'notif':
      content = <NotificationsPage/>
      break
    case 'profile':
      content = <ProfilePage onBack={() => setPage('settings')}/>
      break
    case 'settings':
      content = <SettingsPage onNavigate={navigate}/>
      break
    default:
      content = <DashboardPage onNavigate={navigate}/>
  }

  return (
    <>
      {content}
      {showTabBar && <TabBar active={page} onNavigate={(id) => navigate(id)}/>}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
