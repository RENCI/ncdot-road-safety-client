import React, { createContext, useContext } from 'react'

export const RouteContext = createContext({ })

export const useRouteContext = () => useContext(RouteContext)

export const RouteContextProvider = RouteContext.Provider
