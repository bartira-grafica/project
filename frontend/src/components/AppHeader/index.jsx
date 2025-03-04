import React from "react";
import { Link } from "react-router";
import {
  CContainer,
  //   CDropdown,
  //   CDropdownItem,
  //   CDropdownMenu,
  //   CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CTooltip,
  // useColorModes,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  //   cilBell,
  //   cilContrast,
  //   cilEnvelopeOpen,
  //   cilList,
  cilMenu,
  //   cilMoon,
  //   cilSun,
  cilExitToApp,
} from "@coreui/icons";
import { SidebarStateContext } from "../../contexts";

// import { AppHeaderDropdown } from './header/index'

const AppHeader = () => {
  const headerRef = React.useRef();
  // const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const sidebarStateCtx = React.useContext(SidebarStateContext);

  const changeSidebarState = React.useCallback(() => {
    sidebarStateCtx.setSidebarState(!sidebarStateCtx.sidebarState.isOpen);
  }, [sidebarStateCtx]);

  React.useEffect(() => {
    document.addEventListener("scroll", () => {
      headerRef.current &&
        headerRef.current.classList.toggle(
          "shadow-sm",
          document.documentElement.scrollTop > 0
        );
    });
  }, []);

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
              <CNavLink to="/" as={Link}>
                <CIcon icon={cilExitToApp} size="lg" />
              </CNavLink>
            </CTooltip>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          {/* <CDropdown variant="nav-item" placement="bottom-end"> */}
          {/* <CDropdownToggle caret={false}>
              {colorMode === "dark" ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === "auto" ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle> */}
          {/* <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu> */}
          {/* </CDropdown> */}
          {/* <AppHeaderDropdown /> */}
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
