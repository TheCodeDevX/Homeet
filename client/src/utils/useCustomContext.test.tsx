import {describe, it, expect, vi, afterEach, test} from "vitest"
import "@testing-library/jest-dom/vitest"
import { useCustomContext } from "./useCustomContext"
import {renderHook} from "@testing-library/react"
import React, { type PropsWithChildren } from "react"
import { DirContext } from "../context/DirectionProvider"



 describe('useCustomContext', () => {

   const wrapper = ({children} : PropsWithChildren) => (
   <DirContext.Provider value={{langDir: "ltr", setLangDir : () => null }}>
   {children}
   </DirContext.Provider>
  ) 

   test("returns context", () => {
   const {result} = renderHook(() => useCustomContext(DirContext, 'useDir'), {wrapper})

    expect(result.current.langDir).toBe("ltr")
    expect(result.current.setLangDir).toBeDefined()
    }) 

    test("throws error when used outside provider", () => {
    expect(() => renderHook(() => useCustomContext(DirContext, 'useDir')))
    .toThrow("useDir must be used within a provider")
    }) // we don't have to test if the createdContext is unavailable since TS throws a ts error immediately.


    test("uses fallback name when hook name in undefined", () => {
    expect(() => renderHook(() => useCustomContext(DirContext, undefined)))
    .toThrow("useCustomHookName must be used within a provider")
    })

 })

 