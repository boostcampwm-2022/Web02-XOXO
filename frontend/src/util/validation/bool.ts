import { yyyymmdd } from '@src/util'

export const shorter = (num: number) => (str: string) => str.length < num
export const longer = (num: number) => (str: string) => str.length > num
export const between = (small: number, big: number) => (str: string) => longer(small)(str) && shorter(big)(str)
export const containsKO = (str: string) => /[ㄱ-ㅎㅏ-ㅣ가-힣]/g.test(str)
export const containsSpace = (str: string) => str.search(/\s/) !== -1
export const containsEmoji = (str: string) =>
  /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g.test(
    str
  )
export const isFuture = (date: string) => new Date(yyyymmdd(new Date())) < new Date(date)
export const isFutureRatherThanServer = (dueDate: string, serverDate: string) => new Date(serverDate) < new Date(dueDate)
export const isYYYYMMDD = (date: string) => /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(date)
