import React from 'react'
import useSWR from 'swr'
import fetcher from '@src/util/fetcher'
import { isEmpty } from 'lodash'
import { ISuggestion } from '../types'

interface ISuggestions {
  nickname: string
  members: ISuggestion[]
  setMembers: (s: ISuggestion) => void
}

const Suggestions = ({ nickname, members, setMembers }: ISuggestions) => {
  const { data, mutate } = useSWR<ISuggestion[]>(`/users/search/${nickname}`, fetcher)

  if (isEmpty(data)) {
    return null
  }

  const isMemberAlready = (newMember: ISuggestion) => {
    return members.filter(member => member.id === newMember.id).length > 0
  }

  const memberSearchResult = data?.map((suggestion) => (
    <button
      className="suggestion-wrapper"
      key={suggestion.id}
      onClick={(e) => {
        e.preventDefault()
        setMembers(suggestion)
        void mutate([], false)
      }}
      disabled={isMemberAlready(suggestion)}
    >
      <span className="suggestion-nickname">{suggestion.nickname}</span>
      <span className="suggestion-add">추가</span>
    </button>
  ))

  return (
    <>
      {data != null && (
        <div className="suggestions-wrapper">
          {memberSearchResult}
        </div>
      )}
    </>
  )
}

export default Suggestions
