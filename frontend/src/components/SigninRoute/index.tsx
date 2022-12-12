import fetcher from '@src/util/fetcher'
import React from 'react'
import { Navigate } from 'react-router-dom'
import useSWR from 'swr'

interface IAuthRoute {
  children: JSX.Element
}
const SigninRoute = ({ children }: IAuthRoute) => {
  const { data: isLoggined } = useSWR<boolean>('/users', fetcher, { revalidateOnFocus: false })
  if (isLoggined === undefined) return <></>
  return !isLoggined ? children : <Navigate to="/Feeds" />
}

export default SigninRoute
