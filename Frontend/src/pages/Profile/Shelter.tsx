import styles from './Shelter.module.css'

import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { Breadcrumb } from '../../components/Profiles/Breadcrumb'
import { Avatar } from '../../components/Profiles/Avatar'
import { AboutShelter } from '../../components/Profiles/AboutShelter'
import { ProductTable } from '../../components/Profiles/ProductTable'
import { PartnerTable } from '../../components/Profiles/PartnerTable'
import { Table } from '../../components/Profiles/Table'

export function ShelterProfile() {
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
            <h1 className={styles.userName}>Abrigo Quatro Patas</h1>
            <p className={styles.userCity}>
              Rua Logo Ali 320, Jardim das Flores, São José do Rio Preto - São
              Paulo
            </p>
            <a className={styles.button} href="">
              Editar perfil
            </a>
          </div>
          <div className={styles.qtdDonationsContainer}>
            <p className={styles.totalDonations}>
              5 <span>doações recebidas</span>
            </p>
          </div>
          <AboutShelter />
          <ProductTable />
          <PartnerTable />
          <Table />
        </div>
      </div>
      <Footer />
    </>
  )
}
