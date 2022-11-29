import { useState } from 'react'
import Modal from 'react-modal'
import { Button } from '../../../../../components/Forms/Button'
import { Input } from '../../../../../components/Forms/Input'
import { ReactComponent as CloseIcon } from '../../../../../assets/Close-Icon.svg'
import { ReactComponent as EditIcon } from '../../../../../assets/Edit-Icon.svg'
import styles from './CouponTable.module.css'
import usePrivateApi from '../../../../../hooks/useAxiosPrivate'
import { CouponType } from '../../../../../types/Coupon'

interface CouponTableProps {
  coupons: CouponType[]
  onSuccess(coupon: CouponType): void
}
export function CouponTable({ coupons, onSuccess }: CouponTableProps) {
  const api = usePrivateApi()
  const [coupon, setCoupon] = useState<CouponType | null>(null)

  async function handleSubmit(event: any) {
    event.preventDefault()
    if (!coupon) {
      return
    }

    try {
      if (coupon.id) {
        await api.patch(`partner/coupon/${coupon.id}`, coupon)
        alert('Cupom alterado com sucesso')
      } else {
        const response = await api.post(`partner/coupon/`, coupon)
        coupon.id = response.data
        alert('Cupom cadastrado com sucesso')
      }
      onSuccess(coupon)
      setCoupon(null)
    } catch (e) {
      console.log('Cupom não alterado')
    }
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h3>Cupons Cadastrados</h3>
        <button
          onClick={() => setCoupon({} as CouponType)}
          className={styles.buttonAdd}
        >
          Cadastrar Cupom
        </button>
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
            coupons.map(coupon => (
              <tr key={coupon.id}>
                <td>{coupon.code}</td>
                <td>{coupon.active ? 'Ativo' : 'Inativo'}</td>
                <td>
                  <button
                    className={styles.iconButton}
                    onClick={() => setCoupon(coupon)}
                  >
                    <EditIcon />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Modal
        isOpen={!!coupon}
        onRequestClose={() => setCoupon(null)}
        className={styles.modal}
        ariaHideApp={false}
      >
        {coupon && (
          <>
            <div className={styles.headerModal}>
              <h2>{coupon.id ? 'Editar' : 'Cadastrar'} Cupom</h2>
              <button
                className={styles.iconButton}
                onClick={() => setCoupon(null)}
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <Input
                label="Código Cupom"
                type="text"
                name="code"
                onChange={event =>
                  setCoupon(
                    prev => prev && { ...prev, code: event.target.value },
                  )
                }
                value={coupon.code}
              />
              {coupon.id && (
                <label>
                  <input
                    type="checkbox"
                    checked={coupon?.active}
                    onChange={() =>
                      setCoupon(
                        prev => prev && { ...prev, active: !prev.active },
                      )
                    }
                  />
                  Ativo
                </label>
              )}
              <Button type="submit">
                {coupon.id ? 'Editar' : 'Cadastrar'}
              </Button>
            </form>
          </>
        )}
      </Modal>
    </div>
  )
}
