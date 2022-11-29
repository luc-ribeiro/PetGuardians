import { DonationType } from '../../types/Donation'
import styles from './DonationsCounter.module.css'

interface DonationCounterProps {
  donations: DonationType[]
}

export function DonationsCounter({ donations }: DonationCounterProps) {
  return (
    <p className={styles.totalDonations}>
      {donations?.length ?? '0'} <span>doações recebidas</span>
    </p>
  )
}
