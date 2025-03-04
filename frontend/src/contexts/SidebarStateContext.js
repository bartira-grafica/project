import { createContext } from "react";

const DEFAULT_VALUE = {
  sidebarState: {
    isOpen: true,
  },
  setSidebarState: () => {},
};

const SidebarStateContext = createContext(DEFAULT_VALUE);

export default SidebarStateContext;
