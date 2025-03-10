import React from "react";

import {
  CCardTitle,
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
} from "@coreui/react";

import { AppSidebarNav } from "..";

import { SidebarStateContext } from "../../contexts";

// sidebar nav config
import navigation from "./_nav";

const AppSidebar = () => {
  const sidebarStateCtx = React.useContext(SidebarStateContext);

  const handleCloseSidebar = () => sidebarStateCtx.setSidebarState(false);

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={false}
      visible={sidebarStateCtx.sidebarState.isOpen}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CCardTitle>F2R SOLUTIONS</CCardTitle>
        </CSidebarBrand>
        <CCloseButton className="d-lg-none" dark onClick={handleCloseSidebar} />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
