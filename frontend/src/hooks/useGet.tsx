import { useCallback } from 'react'
import axios from 'axios'

const useGet = (url: string) => {
  const post = useCallback(
    async (options?: object) => {
      try {
        const response = await axios.get(`/api${url}`, { ...options, withCredentials: true })
        return response.data
      } catch (err) {
        return err
      }
    },
    [url]
  )

  return post
}

export default useGet
