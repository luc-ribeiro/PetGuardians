import styles from './ProductTable.module.css'

import ProductImage1 from '../../assets/product-image-1.jpg'
import ProductImage2 from '../../assets/product-image-2.jpg'

export function ProductTable() {
  return (
    <div className={styles.productContainer}>
      <div className={styles.productHeader}>
        <h3>Precisamos de</h3>
        <a className={styles.button} href="">
          Cadastrar / Editar
        </a>
      </div>

      <div className={styles.productWrapper}>
        <div className={styles.product}>
          <img src={ProductImage1} alt="" />
          <p className={styles.productName}>Ração 15kg</p>
          <p className={styles.productPrice}>R$ 39,90</p>
        </div>
        <div className={styles.product}>
          <img src={ProductImage2} alt="" />
          <p className={styles.productName}>Ração 15kg</p>
          <p className={styles.productPrice}>R$ 39,90</p>
        </div>
      </div>
    </div>
  )
}
