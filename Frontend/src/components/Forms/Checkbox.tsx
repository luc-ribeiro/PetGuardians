import styles from './Checkbox.module.css'

interface CheckboxProps {
  label?: string
  name: string
  value?: string
  onClick?: (event: Event) => void
}

export function Checkbox({ label, name, value }: CheckboxProps) {
  return (
    <div className={styles.wrapper}>
      <input
        id={name}
        name={name}
        className={styles.input}
        type="checkbox"
        value={value}
      />
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
    </div>
  )
}
