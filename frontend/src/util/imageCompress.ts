import imageCompression from 'browser-image-compression'

export const compressImage = async (imageFile: File) => {
  const options = {
    maxSizeMB: 0.5,
    fileType: 'image/jpeg'
  }

  const compressedFile = await imageCompression(imageFile, options)
  return compressedFile
}
