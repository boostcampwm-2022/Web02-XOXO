export const canvasToFile = (canvas: HTMLCanvasElement) => {
  return new Promise<File>((resolve) => {
    canvas?.toBlob(
      (blob) => {
        const convertedFile = new File([blob as BlobPart], 'name.jpeg', { type: 'image/jpeg' })
        resolve(convertedFile)
      },
      'image/jpeg',
      100
    )
  })
}
