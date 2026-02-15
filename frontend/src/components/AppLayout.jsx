import { Outlet, useLocation } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import DashboardNavbar from "./DashboardNavbar";

const AppLayout = () => {
  const location = useLocation();

  const isDashboard =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/simulator") ||
    location.pathname.startsWith("/skills") ||
    location.pathname.startsWith("/feedback");

  return (
    <div className="app-layout">
      {isDashboard ? <DashboardNavbar /> : <PublicNavbar />}
      
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
