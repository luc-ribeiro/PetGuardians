import styles from './Checkbox.module.css'

interface CheckboxProps {
  label: string
  isChecked: boolean
  name: string
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function Checkbox(props: CheckboxProps) {
  return (
    <div className={styles.wrapper}>
      <input
        type="checkbox"
        name={props.name}
        id={props.label}
        checked={props.isChecked}
        onChange={props.handleChange}
      />
      <label htmlFor={props.label} className={styles.label}>
        {props.label}
      </label>
    </div>
  )
}
