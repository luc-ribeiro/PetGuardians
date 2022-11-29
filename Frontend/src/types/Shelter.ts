import { DonationType } from './Donation'
import { ImageType } from './Image'
import { PersonType } from './Person'

export interface ShelterType extends PersonType {
  fantasyName: string
  images: ImageType[]
  about?: string | null
  keyPIX?: string
  donations: DonationType[]
}
