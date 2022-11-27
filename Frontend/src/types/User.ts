export type User = {
  shelter?: {
    fantasyName: string
    id: number
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

  donor?: {
    id: number
    fullName: string
    gcg: string
    telephone: string
    birthday: string

    cep: string
    uf: string
    city: string
    street: string
    streetNumber: string
    district: string
    complement: string

    email: string
    password: string
  }

  partner?: {
    id: number
    corporateName: string
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

    linkSite?: string
  }
}
