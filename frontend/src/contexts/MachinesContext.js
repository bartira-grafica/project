import { createContext } from "react";

const DEFAULT_VALUE = {
  machines: [],
  setMachines: () => {},
};

const AppStateContext = createContext(DEFAULT_VALUE);

export default AppStateContext;
