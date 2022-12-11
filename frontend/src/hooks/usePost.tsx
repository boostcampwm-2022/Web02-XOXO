import { useCallback } from 'react'
import axios from 'axios'

const usePost = (url: string) => {
  const post = useCallback(
    async (body: object, options?: object) => {
      try {
        const response = await axios.post(`/api${url}`, body, { ...options, withCredentials: true })
        return response.data
      } catch (err) {
        console.log(err)
      }
    },
    [url]
  )

  return post
}

export default usePost
