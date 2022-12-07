import axios from 'axios'

const fetcher = async (url: string) => {
  const response = await axios.get(url)
  console.log(response.data.data)

  return response.data.data
}

export default fetcher
