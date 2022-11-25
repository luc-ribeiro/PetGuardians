import { useEffect, useState } from 'react'
import { useApi } from '../../services/api'
import { User } from '../../types/User'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<User | null>(null)
  const api = useApi()

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user')
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser)
      setUser(foundUser)
    }
  }, [])

  async function signIn(email: string, password: string) {
    const data = await api.signIn(email, password)
    if ((data.shelter || data.donor || data.partner) && data.accessToken) {
      setUser(data.shelter || data.donor || data.partner)
      setToken(data.accessToken)
      setUserStorage(data.shelter || data.donor || data.partner)
      return true
    }
    return false
  }

  async function signOut() {
    setUser(null)
    setToken('')
    setUserStorage('')
    await api.signOut()
  }

  const setUserStorage = (data: any) => {
    localStorage.setItem('user', JSON.stringify(data))
  }

  const setToken = (token: string) => {
    localStorage.setItem('authToken', token)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
