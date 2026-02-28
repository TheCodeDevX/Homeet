import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest"
import { act, renderHook } from "@testing-library/react";
import { useLangStore, type Lang } from "./languageStore";
import { availableLangs } from "../constants";


describe("languageStore", () => {
    const createLocalStorageMock = () => {
      let store : Record<string, string> = {};
      return {
        getItem : vi.fn((key:string) => (store[key] || null) ?? "en" ), 
        setItem : vi.fn((key:string, value : Lang | string) => store[key] = value),
        removeItem : vi.fn((key:string) => {
        delete store[key];
        }),
        clear : vi.fn(() => {
            store = {};
        }) 
      }
    }

    const localStorageMock = createLocalStorageMock();
    globalThis.localStorage = localStorageMock as any;

    beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks();
    useLangStore.setState({lang : 'en'});
    });
    it("saves the selected language to localStorage", () => {
     const {result} = renderHook(() => useLangStore());

     act(() => {
        result.current.setLang("en");
     })
     expect(result.current.lang).toBe("en");
     expect(localStorageMock.setItem).toHaveBeenCalled()
     expect(localStorageMock.setItem).toHaveBeenCalledWith("lang", "en")
     expect(localStorageMock.getItem("lang")).toBe("en")
    })

    it("defaults to 'en' when no language value is stored under the selected key", () => {
     const {result} = renderHook(() => useLangStore());
     act(() => {
      result.current.setLang("ar");
     })
     expect(localStorageMock.getItem("invalid-key")).toBe("en")
    }),

    it('persits language selection across sessions', () => {
        const {result: session1} = renderHook(() => useLangStore());
        act(() => {
            session1.current.setLang('ar');
        })
        expect(session1.current.lang).toBe("ar")

        const {result: session2} = renderHook(() => useLangStore());
        expect(session2.current.lang).toBe("ar")
    })

    it('supports all available languages', () => {
        const {result} = renderHook(() => useLangStore());
        const langs = availableLangs

        langs.forEach((lang) => {
            act(() => {
                result.current.setLang(lang)
            })

            expect(result.current.lang).toBe(lang)
            expect(localStorageMock.setItem).toHaveBeenCalledWith('lang', lang)
        })
    });
})