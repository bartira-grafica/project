import { useEffect, useContext } from "react";

import { Outlet, useNavigate } from "react-router";
import { AppHeader, AppSidebar, AppFooter } from "../../components";

import { AppStateContext, MachinesContext } from "../../contexts";

import { fetchMachines } from "../../utils";

const AppLayout = () => {
  const navigate = useNavigate();
  const { setMachines } = useContext(MachinesContext);
  const { setAppState } = useContext(AppStateContext);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token === null) navigate("/");
    else {
      fetchMachines(token, setMachines, setAppState, navigate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <Outlet />
        </div>
        <AppFooter />
      </div>
    </>
  );
};

export default AppLayout;
