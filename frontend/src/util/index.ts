export const onChange = (e: React.ChangeEvent<HTMLInputElement>, type: React.MutableRefObject<string>) => {
  const value = e.target.value
  type.current = value
}
