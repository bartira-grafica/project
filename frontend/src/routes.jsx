import { Route, Routes } from "react-router";
import { Login, Register, Dashboard, GerenciarEsteiras } from "./pages";
import { AppLayout } from "./layouts";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registrar" element={<Register />} />
      <Route path="/" element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="gerenciar">
          <Route path="esteiras" element={<GerenciarEsteiras />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
