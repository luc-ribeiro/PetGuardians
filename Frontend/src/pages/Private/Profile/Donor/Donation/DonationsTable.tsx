import { DonationType } from '../../../../../types/Donation'
import styles from './DonationsTable.module.css'

interface DonationTableProps {
  donations: DonationType[]
}

export function DonationsTable({ donations }: DonationTableProps) {
  return (
    <div className={styles.tableContainer}>
      <h3>Últimas doações</h3>

      <table className={styles.table}>
        {!donations && (
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data</th>
              <th>Valor</th>
            </tr>
          </thead>
        )}

        <tbody>
          {!donations.length ? (
            <div style={{ textAlign: 'center' }}>Sem doações realizadas</div>
          ) : (
            donations.map(
              donation =>
                donation.approved && (
                  <tr>
                    <td>{donation.id}</td>
                    <td>{donation.createdAt}</td>
                    <td>R$ {donation.value}</td>
                  </tr>
                ),
            )
          )}
        </tbody>
      </table>
    </div>
  )
}
