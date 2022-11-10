import { ChangeEventHandler, ReactNode, FocusEventHandler } from 'react'
import styles from './Input.module.css'

interface InputProps {
  label?: string
  type: string
  name: string
  placeholder?: string
  value?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  error?: ReactNode
  onBlur?: FocusEventHandler<HTMLInputElement>
  width?: string
}

export function Input({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  error,
  onBlur,
  width = '100%',
}: InputProps) {
  return (
    <div className={styles.wrapper} style={{ width }}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        className={styles.input}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
