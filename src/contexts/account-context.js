import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AccountContext = createContext({ })

const useAccount = () => useContext(AccountContext)

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState()

  useEffect(() => {
    setAccount({ id: 13 })
  }, [])
 
  return (
    <AccountContext.Provider value={{ account }}>
      { children }
    </AccountContext.Provider>
  )
} 
