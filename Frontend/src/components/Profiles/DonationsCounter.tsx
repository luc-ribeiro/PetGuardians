import styles from './DonationsCounter.module.css'

export function DonationsCounter() {
  return (
    <p className={styles.totalDonations}>
      5 <span>doações recebidas</span>
    </p>
  )
}
