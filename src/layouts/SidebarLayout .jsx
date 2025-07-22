import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { FaBookOpen, FaClipboardList, FaFileInvoice, FaSyncAlt, FaBell, FaUserCircle } from "react-icons/fa";
import logo from "../assets/timelineLogo.png"

const SidebarLayout = () => {
  return (
    <div className="flex h-screen flex-col">
      <header className="bg-white shadow-md px-6 py-3 flex items-center justify-between border-b border-slate-100 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-sky-200 to-blue-200 rounded-full p-2 flex items-center justify-center shadow-md">
            <img src={logo} alt="logo" className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight drop-shadow-sm">TimeLine-Chart</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative text-slate-400 hover:text-sky-500 transition-colors">
            <FaBell size={22} />
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full px-1 py-0.5 shadow">3</span>
          </button>
          <div className="flex items-center gap-2">
            <FaUserCircle size={28} className="text-slate-400" />
            <span className="text-slate-700 font-medium text-sm">Admin</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden bg-slate-50">
        <aside className="w-60 bg-gradient-to-b from-slate-900 to-slate-700 text-slate-100 flex flex-col rounded-tr-3xl rounded-br-3xl shadow-xl border-r border-slate-800 z-20">
          <nav className="flex-1 p-4 space-y-2 text-sm">
            <NavLink
              to="process"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm ${isActive
                  ? "bg-sky-500/20 text-sky-300 shadow"
                  : "hover:bg-slate-800 hover:text-sky-300 text-slate-100"
                }`
              }
            >
              <FaSyncAlt size={18} />
              <span>Process</span>
            </NavLink>

            <NavLink
              to="recipe"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm ${isActive
                  ? "bg-sky-500/20 text-sky-300 shadow"
                  : "hover:bg-slate-800 hover:text-sky-300 text-slate-100"
                }`
              }
            >
              <FaBookOpen size={18} />
              <span>Recipe</span>
            </NavLink>

            <NavLink
              to="newpo"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm ${isActive
                  ? "bg-sky-500/20 text-sky-300 shadow"
                  : "hover:bg-slate-800 hover:text-sky-300 text-slate-100"
                }`
              }
            >
              <FaFileInvoice size={18} />
              <span>New PO</span>
            </NavLink>

            <NavLink
              to="po-detail"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm ${isActive
                  ? "bg-sky-500/20 text-sky-300 shadow"
                  : "hover:bg-slate-800 hover:text-sky-300 text-slate-100"
                }`
              }
            >
              <FaClipboardList size={18} />
              <span>PO Detail</span>
            </NavLink>
          </nav>
          <div className="p-4 border-t border-slate-800 text-xs text-slate-400 mt-2">
            © 2025 TimeLine-Chart
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
