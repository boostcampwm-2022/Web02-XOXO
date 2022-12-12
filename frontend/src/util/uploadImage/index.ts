import { compressImage } from '../imageCompress'
export const uploadImage = async (files: File[], postImage: (body: object, options?: object) => Promise<any>) => {
  const formData = new FormData()
  const promises = files.map(async (file) => {
    const compressedImage = await compressImage(file)
    formData.append('image', compressedImage)
  })
  await Promise.all(promises)
  const { data } = await postImage(formData)
  return data
}
