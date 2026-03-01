import { createContext } from "react";
import type { BookingStates } from "../BookingProvider";

export const BookingContext = createContext<BookingStates | undefined>(undefined);