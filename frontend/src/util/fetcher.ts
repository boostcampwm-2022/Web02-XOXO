import axios from 'axios'
import { isEmpty } from 'lodash'

const fetcher = async (url: string) => {
  const response = await axios.get(url)
  const { success, status, data } = response.data
  if (isEmpty(success)) console.log(status)
  return data
}

export default fetcher
