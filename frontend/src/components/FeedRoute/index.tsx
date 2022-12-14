import axios from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

interface IFeedRoute {
  Component: () => ReactElement
}
const FeedRoute = ({ Component }: IFeedRoute) => {
  const [isLoggined, setIsLoggined] = useState<Boolean | undefined>(undefined)
  const { feedId } = useParams<{ feedId: string }>()

  useEffect(() => {
    if (feedId !== undefined) {
      window.localStorage.setItem('feedId', feedId)
    }
  }, [feedId])
  useEffect(() => {
    void (async () => {
      const response = await axios.get('/api/users')
      setIsLoggined(response.data.data)
    })()
  }, [])
  if (isLoggined === undefined) return <></>
  return isLoggined === true ? <Component /> : <Navigate to="/Signin" />
}

export default FeedRoute
