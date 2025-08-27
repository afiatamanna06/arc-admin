import { atomWithStorage } from "jotai/utils";

export type DarkModeAtom = string;

export default atomWithStorage<DarkModeAtom>("darkMode", "light");
