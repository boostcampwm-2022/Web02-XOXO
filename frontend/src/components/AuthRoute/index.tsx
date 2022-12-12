import fetcher from '@src/util/fetcher'
import { isEmpty } from 'lodash'
import React, { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import useSWR from 'swr'

interface IAuthRoute {
  Component: () => ReactElement
}
const AuthRoute = ({ Component }: IAuthRoute) => {
  const { data: isLoggined } = useSWR('/users', fetcher)
  console.log(isLoggined)

  return isEmpty(isLoggined) ? <Component /> : <Navigate to="/Signin" />
}

export default AuthRoute
