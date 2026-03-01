import { createContext } from "react";
import type { DirStates } from "../../types/types";


export const DirContext = createContext<DirStates | undefined>(undefined);
