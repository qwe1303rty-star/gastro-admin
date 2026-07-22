import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import PinScreen from './components/PinScreen'
import Layout from './components/Layout'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import StatsPage from './pages/StatsPage'

function AppRoutes() {
  const { isAuth } = useAuth()

  if (!isAuth) return <PinScreen />

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<OrdersPage />} />
        <Route path="/order/:id" element={<OrderDetailPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
