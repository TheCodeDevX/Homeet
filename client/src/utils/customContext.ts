import { useContext } from "react";

export const customContext = <T,>(createdContext:React.Context<T>, customHookName:string) => {
    const context = useContext(createdContext)
    if(!context) throw new Error(`${customHookName} must be used within a provider`)
    return context;
  }