export type User = {
  role: string

  shelter: {
    fantasyName: string
    about: string
    keyPIX: string
  }

  donor: {
    birthday: string | null
  }

  partner: {
    fantasyName: string
    linkSite: string
  }

  person: {
    name: string
    gcg: string
    telephone: string
    street: string
    streetNumber: string
    complement: string
    district: string
    cep: string
    uf: string
    city: string
    profilePicture: string
    profilePictureMimeType: string
    images: []
  }
}
