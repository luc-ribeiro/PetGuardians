import { SelectHTMLAttributes } from 'react'
import styles from './Select.module.css'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name?: string
  label: string
  options: Array<{
    value: string
    label: string
  }>
  width?: string
}

export function Select({
  label,
  name,
  options,
  width = '100%',
  ...rest
}: SelectProps) {
  return (
    <div className={styles.wrapper} style={{ width }}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <select value="" id={name} {...rest} className={styles.select}>
        <option value="" hidden>
          Selecione
        </option>
        {options.map(option => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )
        })}
      </select>
    </div>
  )
}
