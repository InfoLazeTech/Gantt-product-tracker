import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { FaBookOpen, FaClipboardList, FaFileInvoice, FaSyncAlt, FaBell, FaUserCircle } from "react-icons/fa";
import logo from "../assets/timelineLogo.png"

const SidebarLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen flex-col">
      <header className="bg-white shadow-md px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-100 z-10">
        <div className="flex items-center gap-3">
          {/* Hamburger for mobile */}
          <button
            className="md:hidden mr-2 text-slate-600 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="bg-gradient-to-br from-sky-200 to-blue-200 rounded-full p-2 flex items-center justify-center shadow-md">
            <img src={logo} alt="logo" className="w-8 h-8" />
          </div>
          <h1 className="text-lg sm:text-2xl font-extrabold text-slate-800 tracking-tight drop-shadow-sm">TimeLine-Chart</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <FaUserCircle size={24} className="text-slate-400" />
            <span className="text-slate-700 font-medium text-xs sm:text-sm">Admin</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden bg-slate-50">
        {/* Sidebar for desktop */}
        <aside className="hidden md:flex w-60 bg-gradient-to-b from-slate-900 to-slate-700 text-slate-100 flex-col rounded-tr-3xl rounded-br-3xl shadow-xl border-r border-slate-800 z-20">
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

        {/* Sidebar Drawer for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-30"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar overlay"
            ></div>
            {/* Drawer */}
            <aside className="relative w-60 bg-gradient-to-b from-slate-900 to-slate-700 text-slate-100 flex flex-col rounded-tr-3xl rounded-br-3xl shadow-xl border-r border-slate-800 z-50 animate-slideInLeft">
              <button
                className="absolute top-2 right-2 text-slate-400 hover:text-white"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <nav className="flex-1 p-4 space-y-2 text-sm mt-8">
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
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
