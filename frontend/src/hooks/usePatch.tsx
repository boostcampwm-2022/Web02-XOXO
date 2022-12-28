import { useCallback } from 'react'
import axios from 'axios'

const usePatch = (url: string) => {
  const patch = useCallback(
    async (body: object, options?: object) => {
      try {
        const response = await axios.patch(`/api${url}`, body, { ...options, withCredentials: true })
        return response.data
      } catch (err: any) {
        console.log(err)

        return err.response.data
      }
    },
    [url]
  )

  return patch
}

export default usePatch
