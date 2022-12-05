import { ISuggestion } from '@src/types'
import { isEmpty } from 'lodash'
import { between, containsEmoji, isFuture, isYYYYMMDD, longer } from './bool'

export const getWarningName = (str: string): string => {
  if (containsEmoji(str)) return '이모지를 포함할 수 없습니다.'
  if (!between(0, 16)(str)) return '피드 이름은 1~15자 입니다.'
  return ''
}
export const getWarningDescription = (str: string): string => {
  if (containsEmoji(str)) return '이모지를 포함할 수 없습니다.'
  if (longer(100)(str)) return '피드 설명은 100자 이하입니다.'
  return ''
}
export const getWarningDuedate = (str: string): string => {
  if (isEmpty(str)) return '한번 설정한 공개일은 추후에 바꿀 수 없습니다.'
  if (containsEmoji(str)) return '이모지를 포함할 수 없습니다.'
  if (!isYYYYMMDD(str)) return '날짜 형식이 잘못되었습니다.'
  if (!isFuture(str)) return '피드 공개일은 오늘 이후입니다.'
  return ''
}
export const getWarningLetter = (str: string): string => {
  if (containsEmoji(str)) return '이모지를 포함할 수 없습니다.'
  if (longer(2000)(str)) return '글 내용은 2000자 이하입니다.'
  return ''
}
export const getWarningNickname = (str: string): string => {
  if (containsEmoji(str)) return '이모지를 포함할 수 없습니다.'
  if (!between(0, 16)(str)) return '닉네임은 1~15자 입니다.'
  return ''
}

export const getWarningMembers = (members: ISuggestion[]): string => {
  if (members.length < 1) return '그룹피드의 맴버는 1명 이상 입니다.'
  if (members.length > 99) return '그룹피드의 맴버는 99명 이하 입니다.'
  return ''
}
export const validName = (str: string): boolean => {
  if (isEmpty(str)) return false
  if (containsEmoji(str)) return false
  if (!between(0, 16)(str)) return false
  return true
}
export const validDescription = (str: string): boolean => {
  if (containsEmoji(str)) return false
  if (longer(100)(str)) return false
  return true
}
export const validDuedate = (str: string): boolean => {
  if (isEmpty(str)) return false
  if (containsEmoji(str)) return false
  if (!isYYYYMMDD(str)) return false
  if (!isFuture(str)) return false
  return true
}
export const validLetter = (str: string): boolean => {
  if (containsEmoji(str)) return false
  if (longer(2000)(str)) return false
  return true
}
export const validNickname = (str: string): boolean => {
  if (containsEmoji(str)) return false
  if (!between(0, 16)(str)) return false
  return true
}
export const validMembers = (members: ISuggestion[]): boolean => {
  if (members.length < 1) return false
  if (members.length > 99) return false
  return true
}
