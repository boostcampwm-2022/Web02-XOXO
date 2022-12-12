export const uploadImage = async (files: File[], postImage: (body: object, options?: object) => Promise<any>) => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('image', file)
  })
  const { data } = await postImage(formData)
  return data
}
