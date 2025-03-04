import { Outlet } from "react-router";
import { AppHeader, AppSidebar, AppFooter } from "../../components";

const AppLayout = () => {
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
