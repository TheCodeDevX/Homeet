import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest"
import { act, renderHook } from "@testing-library/react";
import { availableThemes, type Theme } from "../constants";
import { useThemeStore } from "./themeStore";

const createLocalStorageMock = () => {
    let store : Record<string, string> = {};
   return {
    getItem : vi.fn((key: string) => (store[key] || null) ?? 'dark'),
    setItem : vi.fn((key: string, value : Theme) => store[key] = value),
    removeItem : vi.fn((key: string) => delete store[key]),
    clear : vi.fn(() => store = {})
   }
}

describe('themeStore', () => {
    const localStorageMock = createLocalStorageMock();
    globalThis.localStorage = localStorageMock as any
    beforeEach(() => {
        localStorage.clear();
        useThemeStore.setState({theme : 'dark'});
        vi.clearAllMocks();
    });

    it('saves a selected theme to localStorage', () => {
        const {result} = renderHook(() => useThemeStore());
        act(() => {
            result.current.setTheme("coffee");
        })

        expect(result.current.theme).toBe("coffee")
        expect(localStorageMock.setItem).toHaveBeenCalled()
        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'coffee');
    })

    it('defaults to "dark" when no theme value is stored under the selected key', () => {
        const {result} = renderHook(() => useThemeStore());
        act(() => {
            result.current.setTheme("coffee");
        })
        expect(localStorageMock.getItem("invalid-key")).toBe("dark")
    }),

    it('persits theme selection across sessions', () => {
        const {result: session1} = renderHook(() => useThemeStore());
        act(() => {
            session1.current.setTheme("dark");
        })
        expect(session1.current.theme).toBe("dark")

        const {result: session2} = renderHook(() => useThemeStore());
        expect(session2.current.theme).toBe("dark")
    })

    it('supports all available themes', () => {
        const {result} = renderHook(() => useThemeStore());
        const themes = availableThemes;

        themes.forEach((theme) => {
            act(() => {
               result.current.setTheme(theme) 
            })

            expect(result.current.theme).toBe(theme)
            expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', theme)
        })
    })
})