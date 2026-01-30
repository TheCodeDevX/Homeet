import { useContext, type Context } from "react";

export const customContext = <T,P>(createdContext:Context<T>, customHookName:P) => {
    const context = useContext(createdContext)
    if(!context) throw new Error(`${customHookName} must be used within a provider`)
    return context;
  }