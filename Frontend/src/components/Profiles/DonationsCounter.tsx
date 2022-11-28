import { DonationType } from '../../types/Donation'
import styles from './DonationsCounter.module.css'

export function DonationsCounter(total: DonationType[]) {
  return (
    <p className={styles.totalDonations}>
      {total.length ?? '0'} <span>doações recebidas</span>
      {console.log(total)}
    </p>
  )
}
