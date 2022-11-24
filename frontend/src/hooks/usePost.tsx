import { useCallback } from 'react'
import axios from 'axios'

const usePost = (url: string) => {
  const post = useCallback(async (data: object) => {
    try {
      const response = await axios.post(url, data)
      return response.data
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
