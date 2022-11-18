import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5201',
})

export default api
