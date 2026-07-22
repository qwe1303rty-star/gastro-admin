import { createContext, useContext, useState } from 'react'
import { PIN_CODE } from '../config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(() => {
    return sessionStorage.getItem('gs_admin_auth') === 'true'
  })

  const login = (pin) => {
    if (pin === PIN_CODE) {
      sessionStorage.setItem('gs_admin_auth', 'true')
      setIsAuth(true)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem('gs_admin_auth')
    setIsAuth(false)
  }

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
