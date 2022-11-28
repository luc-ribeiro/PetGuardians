import { DonationType } from './Donation'
import { PersonType } from './Person'

export interface ShelterType extends PersonType {
  fantasyName: string
  images: []
  about?: string | null
  keyPix?: string
  donations: DonationType[]
}
