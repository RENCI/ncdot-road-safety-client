import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api'

const AccountContext = createContext()

export const useAccount = () => useContext(AccountContext)

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState({ })
  const [annotationDetails, setAnnotationDetails] = useState({ previous: { }, current: { } })

  const refreshAnnotationDetails = async () => {
    const userId = document.getElementById('user_id').value
    const response = await api.getUserAnnotations(userId)
    setAnnotationDetails({
      previous: { ...response.data.total_annots_in_previous_rounds },
      current: { ...response.data.total_annots_in_current_round },
    })
  }

  useEffect(() => {
    const userId = document.getElementById('user_id').value
    const fetchAccountDetails = async () => {
      const response = await api.getAccountDetails(userId)
      setAccount(response.data)
    }
    fetchAccountDetails()
    refreshAnnotationDetails()
  }, [])

  return (
    <AccountContext.Provider value={{
      account,
      annotationDetails,
      refreshAnnotationDetails,
    }}>
      { children }
    </AccountContext.Provider>
  )
} 