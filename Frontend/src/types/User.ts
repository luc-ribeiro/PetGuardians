export type User = {
  shelter: string

  email: string
  id: number
  name: string

  cep: string
  uf: string
  city: string
  street: string
  streetNumber: string
  district: string
  complement: string

  active: boolean

  about?: string

  accessToken: string
}
