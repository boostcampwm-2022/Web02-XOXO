import imageCompression from 'browser-image-compression'

export const compressImage = async (imageFile: File) => {
  const options = {
    maxWidthOrHeight: 4000,
    fileType: 'image/jpeg'
  }

  const compressedFile = await imageCompression(imageFile, options)
  return compressedFile
}
