import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const apiPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

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
