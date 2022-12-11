export const bindValue = (e: React.ChangeEvent<HTMLInputElement>, type: React.MutableRefObject<string>) => {
  const value = e.target.value
  type.current = value
}
export const yyyymmdd = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth() + 1 < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${
    date.getDate() < 9 ? `0${date.getDate()}` : date.getDate()
  }`
export const remainDueDate = (dueDate: string) => {
  const future = new Date(dueDate)
  const present = new Date()
  const diff = future.getTime() - present.getTime()
  const diffDay = Math.floor(diff / (1000 * 60 * 60 * 24))
  const diffHour = Math.floor((diff / (1000 * 60 * 60)) % 24)
  return `${diffDay}일 ${diffHour}시간`
}
