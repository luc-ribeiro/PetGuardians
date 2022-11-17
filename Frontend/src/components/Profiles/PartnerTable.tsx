import styles from './PartnerTable.module.css'

import PartnerImage1 from '../../assets/partner-avatar.jpg'

export function PartnerTable() {
  return (
    <div className={styles.partnerContainer}>
      <div className={styles.partnerHeader}>
        <h3>Nossos parceiros</h3>
        <a className={styles.button} href="">
          Cadastrar / Editar
        </a>
      </div>

      <div className={styles.partnerWrapper}>
        <div className={styles.partner}>
          <img src={PartnerImage1} alt="" />
          <p className={styles.partnerName}>Petshop CatDog</p>
        </div>
      </div>
    </div>
  )
}
