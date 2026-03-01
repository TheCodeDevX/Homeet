import { createContext } from "react";
import type { NotificationStates } from "../../types/types";

export const NotificationContext = createContext<NotificationStates | undefined>(undefined)
