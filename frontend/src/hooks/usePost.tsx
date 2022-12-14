import { useCallback } from 'react'
import axios from 'axios'

const usePost = (url: string) => {
  const post = useCallback(
    async (body: object, options?: object) => {
      try {
        const response = await axios.post(`/api${url}`, body, { ...options, withCredentials: true })
        console.log(response.data)

        return response.data
      } catch (err: any) {
        console.log(err)

        return err.response.data
      }
    },
    [url]
  )

  return post
}

export default usePost
