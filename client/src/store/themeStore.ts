import { create } from "zustand";
import type { Theme } from "../constants";

export interface ThemeStates {
    theme : Theme,
    setTheme : (theme : Theme) => void;
 }
 
  export const useThemeStore  = create<ThemeStates>((set) => ({
    theme :  localStorage?.getItem?.("theme") as Theme || "dark" ,
    setTheme : (theme) => {
     localStorage.setItem("theme", theme)
     set({theme:theme})
    }
  }) )