import { CouponType } from "./Coupon";
import { PersonType } from "./Person";

export interface PartnerType extends PersonType {
    fantasyName: string,
    coupons: CouponType[]
}