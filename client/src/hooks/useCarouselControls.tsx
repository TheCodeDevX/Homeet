import { useReducer } from "react"

 type Length = number

 
 const useCarouselControls = () => {    
 type Action = {type : "next", length : Length} | {type : "prev", length:Length} 
 | {type : "changeImage", index : number}
 type State = { currentIndex:number }

  function reducer(state:State, action:Action) : State {
        switch(action.type){
          case "next" : return state.currentIndex === action.length - 1
          ? {...state, currentIndex : 0}
          : {...state, currentIndex: state.currentIndex + 1}
  
          case "prev" : return state.currentIndex === 0 
          ? {...state, currentIndex : action.length - 1}
          : {...state, currentIndex : state.currentIndex - 1}

          case "changeImage" : return  {...state, currentIndex : action.index}
  
          default : throw new Error("Unknown action type")
        }
      }
  
      const [state, dispatch] = useReducer(reducer, {currentIndex:0})

      return {state, dispatch}
 }
 
 export default useCarouselControls
 

