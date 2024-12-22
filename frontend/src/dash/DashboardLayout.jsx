

import { Outlet } from "react-router-dom";
import Dashboard from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex ">
      {/* Sidebar */}
      {/* <Dashboard/> */}
      <aside className="fixed w-64 z-20 ">
        <Dashboard />
      </aside>
      {/* Main content area */}
      {/* <div className="flex-1 p-6">
       
        <Outlet />
      </div> */}
       <div className="z-10 relative flex-1  flex-col overflow-y-auto overflow-x-hidden  md:pl-64 md:ml-4">
          {/* Main Content */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
            </div>
          </main>
        </div>
    </div>
  );
};

export default DashboardLayout;
