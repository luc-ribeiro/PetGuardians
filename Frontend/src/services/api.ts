import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:5201',
})

export const useApi = () => ({
  signIn: async (email: string, password: string) => {
    const response = await api.post(
      '/auth/login',
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    return response.data
  },
  signOut: async () => {
    return { status: true }
    const response = await api.post('/logout', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  },
})
