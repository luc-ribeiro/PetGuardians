export type User = {
  id: number
  name: string
  fantasyName: string
  gcg: string
  telephone: string

  cep: string
  uf: string
  city: string
  street: string
  streetNumber: string
  district: string
  complement: string

  email: string
  password: string

  about?: string | null

  keyPix?: string
}
