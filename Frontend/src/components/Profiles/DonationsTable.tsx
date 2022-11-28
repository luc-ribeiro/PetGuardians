import { DonationType } from '../../types/Donation'
import styles from './DonationsTable.module.css'

export function DonationsTable(donations: DonationType[]) {
  return (
    <div className={styles.tableContainer}>
      <h3>Últimas doações</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Data</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {/* {donations.map(donation => (
            <tr>
              <td>{donation.id}</td>
              <td>{donation.createdAt}</td>
              <td>R$ {donation.value}</td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  )
}
