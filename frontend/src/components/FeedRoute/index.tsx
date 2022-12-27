import axios from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

interface IFeedRoute {
  Component: () => ReactElement
}
const FeedRoute = ({ Component }: IFeedRoute) => {
  const [isLoggined, setIsLoggined] = useState<Boolean | undefined>(undefined)
  const { feedId } = useParams<{ feedId: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    const storedId = window.localStorage.getItem('feedId')
    if (feedId !== undefined) {
      if (isLoggined === false) {
        window.localStorage.setItem('feedId', feedId)
      } else {
        if (storedId !== null) {
          if (feedId === storedId) {
            window.localStorage.removeItem('feedId')
          } else {
            navigate(`/Feed/${storedId}`)
          }
        }
      }
    }
  }, [feedId, isLoggined])
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
