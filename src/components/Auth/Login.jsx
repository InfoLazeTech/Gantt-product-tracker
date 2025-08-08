// // src/components/Login.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "../../redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/timelineLogo.png";
// import bg from "../../assets/login.webp";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const handleLogin = async () => {
    if (!email || !password) {
      setFormError("Please fill in both email and password");
      return;
    }

    setLoading(true);
    setFormError("");
    setError("");

    try {
      await dispatch(loginAdmin({ email, password })).unwrap(); // .unwrap() to catch rejected promise
    } catch (err) {
      // You can customize this message based on the API error structure
      let errorMessage = err?.message || "Invalid email or password.";
      setError(errorMessage);
    } finally {
      setLoading(false);
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
        style={{
          backgroundImage: "linear-gradient(to bottom right, #c2e9fb, #a1c4fd)",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-0" />

        {/* Animated SVG */}
        <svg
          className="absolute top-0 left-0 w-full h-full z-0 opacity-10"
          viewBox="0 0 800 500"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path fill="#ffffff">
            <animate
              attributeName="d"
              dur="15s"
              repeatCount="indefinite"
              values="
          M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100 L1000,500 L0,500 Z;
          M0,200 C200,100 300,300 500,200 C700,100 800,300 1000,200 L1000,500 L0,500 Z;
          M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100 L1000,500 L0,500 Z
        "
            />
          </path>
        </svg>

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

          {/* <div className="mb-6 relative">
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              className="absolute top-10 right-3 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div> */}
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
              className="absolute top-8 right-3  text-gray-500 cursor-pointer rounded hover:bg-gray-200 transition p-2"
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
          {formError && (
            <p className="text-red-500 mt-4 text-center">{formError}</p>
          )}
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
