import styles from './CouponTable.module.css'
import { CouponType } from '../../../../../types/Coupon'

interface CouponTableProps {
  coupons: CouponType[]
}
export function CouponTable({ coupons }: CouponTableProps) {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h3>Cupons Cadastrados</h3>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Ativo</th>
          </tr>
        </thead>
        <tbody>
          {!coupons.length ? (
            <div>Sem cupom cadastrado</div>
          ) : (
            coupons.map(
              coupon =>
                coupon.active && (
                  <tr key={coupon.id}>
                    <td>{coupon.code}</td>
                    <td>{coupon.active ? 'Ativo' : 'Inativo'}</td>
                  </tr>
                ),
            )
          )}
        </tbody>
      </table>
    </div>
  )
}
