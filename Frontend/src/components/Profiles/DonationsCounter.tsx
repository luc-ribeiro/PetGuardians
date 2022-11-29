import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { DonationType } from '../../types/Donation'
import styles from './DonationsCounter.module.css'

interface DonationCounterProps {
  donations: DonationType[]
  type: 'recebidas' | 'realizadas'
}

export function DonationsCounter({ donations, type }: DonationCounterProps) {
<<<<<<< HEAD
  const { auth } = useAuth()

=======
>>>>>>> origin/Backend-Dev
  return (
    <p className={styles.totalDonations}>
      {donations?.length ?? '0'} <span>doações {type}</span>
    </p>
  )
}
