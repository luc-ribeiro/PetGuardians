import styles from './ProductTable.module.css'

import ProductImage1 from '../../assets/product-image-1.jpg'
import ProductImage2 from '../../assets/product-image-2.jpg'
import { Link } from 'react-router-dom'

export function ProductTable() {
  return (
    <div className={styles.productContainer}>
      <div className={styles.productHeader}>
        <h3>Produtos</h3>
        <Link className={styles.button} to="/produtos">
          Ver todos
        </Link>
      </div>

      <div className={styles.productWrapper}>
        <div className={styles.product}>
          <img src={ProductImage1} alt="" />
          <p className={styles.productName}>Ração 15kg</p>
          {/* <p className={styles.productPrice}>R$ 39,90</p> */}
        </div>
        <div className={styles.product}>
          <img src={ProductImage2} alt="" />
          <p className={styles.productName}>Ração 15kg</p>
          {/* <p className={styles.productPrice}>R$ 39,90</p> */}
        </div>
      </div>
    </div>
  )
}
