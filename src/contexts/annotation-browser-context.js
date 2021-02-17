import React, { createContext, useReducer } from 'react'

const initialState = {
  images: [],
  nextImages: [],
  oldImages: [],
  numLoad: 5,
  annotation: null,
  userFlags: [],
  userFlagCounts: {},
  flagShortcuts: {}
};

const createImage = id => {
  return {
    id: id,
    metadata: {},
    annotations: [],
    present: {
      left: "absent",
      front: "absent",
      right: "absent"
    },
    flags: []
  }
}

const addShortcut = (shortcuts, flag) => {
  const used = Object.values(shortcuts).map(({ key }) => key)

  for (let i = 0; i < flag.length; i++) {
    const c = flag[i].toLowerCase()

    if (!used.includes(c)) {
      shortcuts[flag] = { 
        key: c, 
        index: i
      }

      break;
    }
  }

  console.log(shortcuts)

  return shortcuts
}

const reducer = (state, action) => {
  switch (action.type) {    

    case 'clearImages':
      return {
        ...state, 
        images: [],
        nextImages: [],
        oldImages: []
      }

    case 'setImages':
      return {
        ...state,
        images: action.ids.map(createImage)
      }

    case 'addNextImages':
      return {
        ...state,
        nextImages: state.nextImages.concat(action.ids.map(createImage))        
      }

    case 'updateImages': {
      let images = state.nextImages.slice(0, state.numLoad)

      if (images.length < state.numLoad && action.ids) {
        images = images.concat(action.ids.slice(0, state.numLoad - images.length).map(createImage))
      }

      return {
        ...state,
        images: images,
        nextImages: state.nextImages.slice(state.numLoad),
        oldImages: [...state.images]
      }
    }

    case 'goBack':
      return {
        ...state,
        images: [...state.oldImages],
        nextImages: state.images.concat(state.nextImages.slice(0, -state.numLoad)),
        oldImages: []
      }

    case 'addImage': {     
      const image = createImage(action.id)

      image.metadata = action.metadata
      image.annotations = action.annotations

      return {
        ...state,
        images: [...state.images, image]        
      }      
    } 

    case 'setAnnotationPresent': {
      const newState = {...state}

      const image = newState.images.find(({ id }) => id === action.id)

      if (image) {
        image.present[action.view] = action.present
      }

      return newState
    }

    case 'setAnnotationRelevant': {
      const newState = {...state}

      const image = newState.images.find(({ id }) => id === action.id)

      if (image) {
        image.relevant[action.view] = action.relevant
      }

      return newState
    }

    case 'setFlags': {
      const newState = {...state}

      const image = newState.images.find(({ id }) => id === action.id)

      if (image) {
        image.flags = action.flags
      }

      return newState
    }

    case 'updateUserFlags': {
      const newState = {...state}

      action.addFlags.forEach(flag => {
        if (!newState.userFlagCounts[flag]) {
          newState.userFlagCounts[flag] = 0

          addShortcut(newState.flagShortcuts, flag)
        }

        newState.userFlagCounts[flag]++
      })

      action.removeFlags.forEach(flag => {
        if (!newState.userFlagCounts[flag]) {
          console.log('Warning: user flag not present')   
          return       
        }
        
        newState.userFlagCounts[flag]--

        if (newState.userFlagCounts[flag] === 0) {
          delete newState.userFlagCounts[flag]
          delete newState.flagShortcuts[flag]
        }
      })

      newState.userFlags = Object.keys(newState.userFlagCounts)

      return newState
    }

    case 'setNumLoad':
      return {
        ...state,
        numLoad: action.numLoad
      } 

    case 'setAnnotation':
      return {
        ...state,
        annotation: action.annotation,        
        nextImages: [],
        userFlags: [],
        userFlagCounts: {},
        flagShortcuts: action.annotation.flags.reduce(addShortcut, {})
    }

    default: 
      throw new Error('Invalid annotation browser context action: ' + action.type)
  }
}

export const AnnotationBrowserContext = createContext(initialState)

export const AnnotationBrowserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
 
  return (
    <AnnotationBrowserContext.Provider value={ [state, dispatch] }>
      { children }
    </AnnotationBrowserContext.Provider>
  )
} 
