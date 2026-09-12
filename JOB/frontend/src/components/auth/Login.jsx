import React, { useState } from "react";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import { log } from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../redux/authSlice";
import Loader from "../Loader";

export default function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);
  const [empty, setEmpty] = useState(false);
  const [message, setMessage] = useState("All fields are mandatory");
  const [showPassword, setShowPassword] = useState(false);

  function handleData(e) {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  async function submitData(e) {
    e.preventDefault();

    try {
      if (input.email == "" || input.password == "" || input.role == "") {
        setEmpty(true);
        toast.error("All fields are mandatory");
        return;
      }

      setEmpty(false);
      dispatch(setLoading(true));

      const formData = new FormData();
      formData.append("email", input.email);
      formData.append("password", input.password);
      formData.append("role", input.role);

      const response = await log(formData);
      dispatch(setUser(response.data.user));
      toast.success(response.data.message);

      navigate("/dashboard");
    } catch (error) {
      setEmpty(true);
      toast.error(error.response?.data?.message || "Login failed!");
      setMessage(error.response?.data?.message);
    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <div>
      <Navbar></Navbar>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          {empty && (
            <h1 className="text-2xl text-center text-red-300 p-2 border rounded-xl">
              {message}
            </h1>
          )}
          <h1 className="text-2xl font-bold">Login</h1>
          <form onSubmit={submitData} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                required
                value={input.email}
                onChange={handleData}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div className="relative w-full">
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={input.password}
                onChange={handleData}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-7 cursor-pointer text-gray-500"
              >
                {showPassword ? "🔓" : "🔒"}
              </span>
            </div>
            <div>
              <input
                type="radio"
                className=" text-gray-700 font-medium"
                name="role"
                value={"Student"}
                onChange={handleData}
              />
              Student
              <input
                className="ml-4  text-gray-700 font-medium"
                type="radio"
                name="role"
                value={"Recruiter"}
                onChange={handleData}
              />
              Recruiter
            </div>

            {loading ? (
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Loader></Loader>
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </button>
            )}
          </form>

          <p className="mt-3.5 text-center">
            {" "}
            Do't have a account?
            <span className="text-blue-400">
              <Link to="/signup">Sign Up</Link>
            </span>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
