import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api'

const AccountContext = createContext()

export const useAccount = () => useContext(AccountContext)

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState({ })
  const [savedImages, setSavedImages] = useState([])

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
      savedImages,
      addSavedImages: images => setSavedImages(Array.from(new Set([ ...savedImages, ...images ]))),
    }}>
      { children }
    </AccountContext.Provider>
  )
} 
