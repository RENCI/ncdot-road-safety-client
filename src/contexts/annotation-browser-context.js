import React, { createContext, useReducer } from 'react'

const initialState = {
  images: [],
  nextImages: [],
  oldImages: [],
  numLoad: 5,
  annotation: null,
  userFlags: [],
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
      const images = [...state.images]
      const userFlags = [...state.userFlags]
      const flagShortcuts = {...state.flagShortcuts}

      const image = images.find(({ id }) => id === action.id)

      action.flags.forEach(flag => {
        if (!state.annotation.flags.includes(flag) && !userFlags.includes(flag)) {
          userFlags.push(flag)
          addShortcut(flagShortcuts, flag)
        }
      })

      if (image) {
        image.flags = action.flags
      }

      return {
        ...state,
        images: images,
        userFlags: userFlags,
        flagShortcuts: flagShortcuts
      }
    }

    case 'removeUserFlagOption': {
      const flagShortcuts = {...state.flagShortcuts}

      delete flagShortcuts[action.option]

      return {
        ...state,
        images: state.images.map(image => (
          {
            ...image,
            flags: image.flags.filter(flag => flag !== action.option)
          }  
        )),
        userFlags: state.userFlags.filter(flag => flag !== action.option),
        flagShortcuts: flagShortcuts
      }
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
