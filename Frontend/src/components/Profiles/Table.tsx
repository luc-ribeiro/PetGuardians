import styles from './Table.module.css'

export function Table() {
  return (
    <div className={styles.tableContainer}>
      <h3>Últimas doações</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Abrigo</th>
            <th>Data</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Quatro Patas</td>
            <td>20/10/2022</td>
            <td>R$ 300,00</td>
          </tr>
          <tr>
            <td>Abrigo Primavera</td>
            <td>18/10/2022</td>
            <td>R$ 150,00</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
