import { Link } from 'react-router-dom'
import styles from './Breadcrumb.module.css'

interface BreadcrumbType {
  type: string
  to: string
}

export function Breadcrumb({ type, to }: BreadcrumbType) {
  return (
    <div className={styles.breadcrumbWrapper}>
      <p className={styles.breadcrumb}>
        <Link to="/">Home</Link> / {type} / {to}
      </p>
    </div>
  )
}
