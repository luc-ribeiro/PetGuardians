import { DonationType } from "./Donation";
import { PersonType } from "./Person";

export interface DonorType extends PersonType {
    birthday: string,
    donations: DonationType[]
}