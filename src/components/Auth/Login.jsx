// // src/components/Login.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "../../redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/timelineLogo.png";
import bg from "../../assets/login.webp"
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (email && password) {
      await dispatch(loginAdmin({ email, password }));
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/admin/po-detail");
    }
  }, [token, navigate]);

  return (
    <>
       <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-8 relative"
          style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-0" />

      {/* Login Card */}
     <div className="relative z-10 p-8 bg-white backdrop-blur-lg rounded-xl shadow-lg max-w-md w-full">
        <div className="flex items-center justify-center gap-x-3 mb-8">
          <div className="bg-gradient-to-br from-sky-200 to-blue-200 rounded-full p-3 shadow-md">
            <img src={logo} alt="logo" className="w-10 h-10" />
          </div>
          <h1 className="text-md sm:text-2xl font-extrabold text-slate-800 tracking-tight">
            TimeLine-Chart
          </h1>
        </div>
        <h6 className="block text-center antialiased font-sans font-bold text-gray-800 text-base ">
          Admin Login
        </h6>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6 relative">
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              className="absolute top-9 right-3 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-blue-600 w-full text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
          >
            ← Back to Home
          </button>
        </div>
        </div>
      </div>
    </>
  );
};

export default Login;

