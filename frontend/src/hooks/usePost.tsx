import { useCallback } from 'react'
import axios from 'axios'
import { isEmpty } from 'lodash'

const usePost = (url: string) => {
  const post = useCallback(async (body: object, options?: object) => {
    try {
      const response = await axios.post(url, body, { ...options, withCredentials: true })
      const { status, data, success } = response.data
      if (isEmpty(success)) console.log(status)
      return data
    } catch (err) {
      console.log(err)
    }
  }, [url])

  return post
}

export default usePost
