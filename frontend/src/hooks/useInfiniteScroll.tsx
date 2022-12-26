import { useEffect, useRef } from 'react'

const useInfiniteScroll = (postings: any, callback: () => void) => {
  const bottomElement = useRef(null)
  useEffect(() => {
    if (bottomElement?.current) {
      const io = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              callback()
            }
          })
        }, {
          threshold: [1.0]
        }
      )
      io.observe(bottomElement.current)
      return () => io.disconnect()
    }
  }, [postings, bottomElement])
  return bottomElement
}

export default useInfiniteScroll
