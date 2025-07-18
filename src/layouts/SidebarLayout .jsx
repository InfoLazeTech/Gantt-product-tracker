import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { FaBookOpen, FaClipboardList, FaFileInvoice, FaSyncAlt } from "react-icons/fa";
import logo from "../assets/timelineLogo.png"

const SidebarLayout = () => {
  return (
    <div className="flex h-screen flex-col">
      <header className="bg-gray-200 shadow-md p-4 flex items-center justify-between">
        <div className="flex">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <h1 className="text-xl font-semibold text-gray-800 mt-1.5">TimeLine-Chart</h1>
        </div>
        <div className="text-sm text-gray-500">Welcome, Admin</div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden bg-gray-100">
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
          <nav className="flex-1 p-6 space-y-4">
            <NavLink
              to="process"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                  ? "bg-gray-700 text-yellow-400"
                  : "hover:bg-gray-800 text-white"
                }`
              }
            >
              <FaSyncAlt />
              Process
            </NavLink>

            <NavLink
              to="recipe"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                  ? "bg-gray-700 text-yellow-400"
                  : "hover:bg-gray-800 text-white"
                }`
              }
            >
              <FaBookOpen />
              Recipe
            </NavLink>

              <NavLink
              to="newpo"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-700 text-yellow-400"
                    : "hover:bg-gray-800 text-white"
                }`
              }
            >
              <FaFileInvoice />
             New PO
            </NavLink>

            <NavLink
              to="po-detail"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                  ? "bg-gray-700 text-yellow-400"
                  : "hover:bg-gray-800 text-white"
                }`
              }
            >
              <FaClipboardList />
              PO Detail
            </NavLink>
          </nav>
          <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
            © 2025 Your Company
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
