export const bindValue = (e: React.ChangeEvent<HTMLInputElement>, type: React.MutableRefObject<string>) => {
  const value = e.target.value
  type.current = value
}
export const yyyymmdd = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth() + 1 < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${
    date.getDate() < 9 ? `0${date.getDate()}` : date.getDate()
  }`
