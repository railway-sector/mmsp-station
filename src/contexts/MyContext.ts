import { createContext } from "react";

type MyDropdownContextType = { station: any; updateStation: any };

const initialState = { station: undefined, updateStation: undefined };

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
