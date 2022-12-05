import React from 'react'
import useSWR from 'swr'
import fetcher from '@src/util/fetcher'
import { isEmpty } from 'lodash'
import { ISuggestion } from '@src/types'
interface ISuggestions {
  nickname: string
  setMembers: (s: ISuggestion) => void
}

const Suggestions = ({ nickname, setMembers }: ISuggestions) => {
  const { data, mutate } = useSWR<ISuggestion[]>(`/users/search/${nickname}`, fetcher)

  if (isEmpty(data)) {
    return null
  }

  return (
    <>
      {data != null && (
        <div className="suggestions-wrapper">
          {data.map((suggestion) => (
            <button
              className="suggestion-wrapper"
              key={suggestion.id}
              onClick={(e) => {
                e.preventDefault()
                setMembers(suggestion)
                void mutate([], false)
              }}
            >
              <span className="suggestion-nickname">{suggestion.nickname}</span>
              <span className="suggestion-add">추가</span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export default Suggestions
