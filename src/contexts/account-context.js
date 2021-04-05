import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api'

const AccountContext = createContext()

export const useAccount = () => useContext(AccountContext)

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState({ })
  const [currentAnnotations, setCurrentAnnotations] = useState([])

  useEffect(() => {
    const userId = document.getElementById('user_id').value
    const fetchAccountDetails = async () => {
      const response = await api.getAccountDetails(userId)
      setAccount(response.data)
    }
    fetchAccountDetails()
  }, [])

  return (
    <AccountContext.Provider value={{
      account: account,
      currentAnnotations,
      storeSceneId: id => setCurrentAnnotations([ ...currentAnnotations, id ]),
    }}>
      { children }
    </AccountContext.Provider>
  )
} 
