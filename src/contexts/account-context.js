import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AccountContext = createContext({ })

const useAccount = () => useContext(AccountContext)

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState()

  useEffect(() => {
    const userId = document.getElementById('user_id').value
    setAccount({ id: userId })
  }, [])
 
  return (
    <AccountContext.Provider value={{ account }}>
      <pre>{JSON.stringify(account, null, 2)}</pre>
      { children }
    </AccountContext.Provider>
  )
} 
