import { TextareaHTMLAttributes } from 'react'

import styles from './TextArea.module.css'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  label: string
}

export function TextArea({ label, name, ...rest }: TextareaProps) {
  return (
    <div className="textarea-block">
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <textarea className={styles.textArea} id={name} {...rest} />
    </div>
  )
}
