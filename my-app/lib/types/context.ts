import { Dispatch, SetStateAction } from "react";
import { ProcessBox } from "./fmea";

export interface BoksModellContextValue {
  showBoks: boolean;
  setShowBoks: Dispatch<SetStateAction<boolean>>;
}

export interface FmeaFamilyKortContextValue {
  showFmeaFamilyKort: boolean;
  setShowFmeaFamilyKort: Dispatch<SetStateAction<boolean>>;
}

export interface ProcessBoxContextValue {
  processBoxes: ProcessBox[];
  setProcessBoxes: Dispatch<SetStateAction<ProcessBox[]>>;
}
