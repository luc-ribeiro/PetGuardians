import { Navigate } from 'react-router-dom'

type Props = {
  children: JSX.Element
}

export function RequireAuth({ children }: Props) {
  const isAuth = false

  if (!isAuth) {
    return <Navigate to="/login" />
  } else {
    return children
  }
}
