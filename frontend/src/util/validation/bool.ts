export const shorter = (num: number) => (str: string) => str.length < num
export const longer = (num: number) => (str: string) => str.length > num
export const between = (small: number, big: number) => (str: string) => longer(small)(str) && shorter(big)(str)
export const containsKO = (str: string) => /[ㄱ-ㅎㅏ-ㅣ가-힣]/g.test(str)
export const containsSpace = (str: string) => str.search(/\s/) !== -1
