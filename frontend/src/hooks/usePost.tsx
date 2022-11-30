import { useCallback } from 'react'
import axios from 'axios'

const usePost = (url: string) => {
  const post = useCallback(async (data: object, options?: object) => {
    try {
      const response = await axios.post(url, data, { ...options, withCredentials: true })
      return response
    } catch (err) {
      let message
      if (err instanceof Error) message = err.message
      else message = String(err)
      alert(message)
    }
  }, [url])

  return post
}

export default usePost
