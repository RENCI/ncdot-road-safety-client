import React, { createContext, useContext } from 'react'

export const RouteBrowseContext = createContext({ })

export const useRouteBrowseContext = () => useContext(RouteBrowseContext)

export const RouteBrowser = RouteBrowseContext.Provider
