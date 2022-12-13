const getThumbSize = () => {
  const viewPortWidth = window.innerWidth
  let size
  if (viewPortWidth > 425) size = 240
  else if (viewPortWidth > 320) size = 160
  else size = 120
  return size
}

const getThumbUrl = (url: string) => {
  const size = getThumbSize()
  return `${process.env.REACT_APP_CDN_URI as string}/` + url + `?type=m&w=${size}&h=${size}`
}

export default getThumbUrl
