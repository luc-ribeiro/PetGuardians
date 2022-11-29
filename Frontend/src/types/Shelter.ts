import { DonationType } from './Donation'
import { Image } from './Image'
import { PersonType } from './Person'

export interface ShelterType extends PersonType {
  fantasyName: string
  images: Image[]
  about?: string | null
  keyPIX?: string
  donations: DonationType[]
}
