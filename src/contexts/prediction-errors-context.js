import React, { createContext, useContext, useReducer } from 'react'

const initialState = {
  annotation: '',
  allErrors: {},
  errors: [],
  filteredErrors: [],
  routeFilter: null,
  routes: []
};

const getFilteredErrors = (errors, routeFilter) => {
  return errors && routeFilter && routeFilter.length > 0 ? 
    errors.filter(({ route }) => route.includes(routeFilter))
    : errors ? [...errors]
    : null
}

const getRoutes = errors => {
  return errors ? Array.from(errors.reduce((routes, error) => {
    return routes.add(error.route)
  }, new Set()))
  : []
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'setAnnotationErrors': {
      const allErrors = {...state.allErrors}      

      allErrors[action.annotation] = action.errors

      return {
        ...state,
        allErrors: allErrors
      }
    }

    case 'setAnnotation': {
      const errors = state.allErrors[action.annotation]

      if (!errors) return state

      return {
        ...state,
        annotation: action.annotation,
        errors: errors,
        filteredErrors: getFilteredErrors(errors, state.routeFilter),
        routes: getRoutes(errors)
      }
    }

    case 'setRouteFilter': 
      return {
        ...state,
        routeFilter: action.routeFilter,
        filteredErrors: getFilteredErrors(state.errors, action.routeFilter)
      }

    default: 
      throw new Error('Invalid prediction errors context action: ' + action.type)
  }
}

export const PredictionErrorsContext = createContext(initialState)

export const PredictionErrorsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <PredictionErrorsContext.Provider value={ [state, dispatch] }>
      { children }
    </PredictionErrorsContext.Provider>
  )
} 

export const usePredictionErrors = () => useContext(PredictionErrorsContext)
