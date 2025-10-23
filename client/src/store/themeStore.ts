import { create } from "zustand";
import type { Theme } from "../constants";

 interface ThemeSTates {
    theme : Theme,
    setTheme : (theme : Theme) => void;
    
 }
 
  export const useThemeStore  = create<ThemeSTates>((set) => ({
    theme :  localStorage?.getItem("theme") as Theme || "dark" ,
    setTheme : (theme) => {
        localStorage.setItem("theme", theme)
        set({theme:theme})
    }
  }) )