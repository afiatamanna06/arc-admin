import { atomWithStorage } from "jotai/utils";

export type UserAtom = {
    email: string;
};

export default atomWithStorage<UserAtom>("user", { email: "" });
