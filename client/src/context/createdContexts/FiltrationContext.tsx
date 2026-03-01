import { createContext } from "react";
import type { FiltrationContextProps } from "../FilterProvider";

export const FiltrationContext = createContext<FiltrationContextProps | undefined>(undefined);
