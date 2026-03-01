import { createContext } from "react";
import type { SidebarContextProps } from "../../types/types";

  export const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);
 