import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilRunning,
  cilSpeedometer,
} from "@coreui/icons";
import { CNavItem } from "@coreui/react";

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: "Esteira",
    to: "/gerenciar/esteiras",
    icon: <CIcon icon={cilRunning} customClassName="nav-icon" />
  },
];

export default _nav;
