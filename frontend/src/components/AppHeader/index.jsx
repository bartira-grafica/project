import React from "react";
import { Link } from "react-router";
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMenu, cilExitToApp } from "@coreui/icons";
import { SidebarStateContext } from "../../contexts";

const handleLogout = () => {
  localStorage.clear();
}

const AppHeader = () => {
  const headerRef = React.useRef();

  const sidebarStateCtx = React.useContext(SidebarStateContext);

  const changeSidebarState = React.useCallback(() => {
    sidebarStateCtx.setSidebarState(!sidebarStateCtx.sidebarState.isOpen);
  }, [sidebarStateCtx]);

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={changeSidebarState}
          style={{ marginInlineStart: "-14px" }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <CTooltip content="Sair" placement="bottom">
              <CNavLink to="/" as={Link} onClick={handleLogout}>
                <CIcon icon={cilExitToApp} size="lg" />
              </CNavLink>
            </CTooltip>
          </CNavItem>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
