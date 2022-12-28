import axios from 'axios'

const fetcher = async (url: string) => {
  const response = await axios.get(`/api${url}`)

  return response.data.data
}

export default fetcher
