import styles from './Donor.module.css'

import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { Breadcrumb } from '../../components/Profiles/Breadcrumb'
import { Avatar } from '../../components/Profiles/Avatar'
import { Table } from '../../components/Profiles/Table'

export function DonorProfile() {
  return (
    <>
      <Header />
      <div className={`${styles.container} container`}>
        <div className={styles.imageContainer}>
          <Breadcrumb />
          <Avatar />
        </div>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <h1 className={styles.userName}>Elaine Silva</h1>
            <p className={styles.userCity}>São José do Rio Preto, SP</p>
            <a className={styles.button} href="">
              Pesquisar abrigos
            </a>
          </div>
          <div className={styles.qtdDonationsContainer}>
            <p className={styles.totalDonations}>
              2 <span>doações realizadas</span>
            </p>
          </div>
          <Table />
        </div>
      </div>
      <Footer />
    </>
  )
}
