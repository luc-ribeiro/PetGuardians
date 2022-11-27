import styles from './CouponTable.module.css'

export function CouponTable() {
  return (
    <div className={styles.tableContainer}>
      <h3>Cupons Cadastrados</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código</th>

            <th>Ativo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ABRIGO2022</td>

            <td>Sim</td>
          </tr>
          <tr>
            <td>DESCONTO10</td>

            <td>Não</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
