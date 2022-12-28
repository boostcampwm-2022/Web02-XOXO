const getThumbSize = (type: string, windowWidth: number) => {
  const level = Math.floor(windowWidth / 100)
  switch (type) {
    case 'postingLQ':
      if (level >= 5) return 50
      if (level >= 4) return 40
      return 30
    case 'posting':
      if (level >= 5) return 1000
      if (level >= 4) return 800
      return 600
    case 'feed':
      if (level >= 4) return 240
      if (level >= 3) return 180
      return 120
    case 'feeds':
      if (level >= 4) return 120
      if (level >= 3) return 90
      return 40
    default:
      return 300
  }
}

const getQueryString = (type: string) => {
  const windowWidth = window.innerWidth
  const size = getThumbSize(type, windowWidth)
  return `?type=m&w=${size}&h=${size}`
}

const getPostingLQThumbUrl = (url: string) => {
  return `${process.env.REACT_APP_CDN_URI as string}/` + url + `${getQueryString('postingLQ')}`
}

const getPostingThumbUrl = (url: string) => {
  return `${process.env.REACT_APP_CDN_URI as string}/` + url + `${getQueryString('posting')}`
}

const getFeedThumbUrl = (url: string) => {
  return `${process.env.REACT_APP_CDN_URI as string}/` + url + `${getQueryString('feed')}`
}

const getFeedsThumbUrl = (url: string) => {
  return `${process.env.REACT_APP_CDN_URI as string}/` + url + `${getQueryString('feeds')}`
}

export { getPostingLQThumbUrl, getPostingThumbUrl, getFeedsThumbUrl, getFeedThumbUrl }
