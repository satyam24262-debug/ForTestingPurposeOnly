import Navbar from "../Navbar";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sign } from "../../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/authSlice";

export default function Signup() {
  const [data, setData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    filename: "",
    role: "",
  });
  const [empty, setEmpty] = useState(false);
  const [errorMessage, setMessage] = useState(
    "All required fields must be filled",
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);
  const [showPassword, setShowPassword] = useState(false);

  function handleData(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  function handleFileData(e) {
    setData({ ...data, [e.target.name]: e.target.files[0] });
  }

  async function showData(e) {
    e.preventDefault();

    try {
      dispatch(setLoading(true));

      if (
        data.email == "" ||
        data.fullname == "" ||
        data.password == "" ||
        data.phone == "" ||
        data.role == "" ||
        data.phone.length < 10
      ) {
        setEmpty(true);
        return;
      }

      setEmpty(false);

      const formData = new FormData();
      formData.append("fullName", data.fullname);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("password", data.password);
      formData.append("role", data.role);
      if (data.filename) formData.append("fileName", data.filename);

      const response = await sign(formData);
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      setEmpty(true);
      toast.error(error.response?.data?.message || "Signup failed!");
      setMessage(error.response?.data?.message || "Signup failed!");
    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <div>
      <Navbar></Navbar>
      <div className="flex items-center justify-center min-h-screen mt-1.5 bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-10">
          <form onSubmit={showData} className="space-y-4">
            {empty && (
              <h1 className="text-center p-2 text-2xl text-red-300 rounded-xl border">
                {errorMessage}
              </h1>
            )}
            <h1 className="font-bold text-2xl">Sign Up</h1>
            <div>
              <label className="block text-gray-700 font-medium">Name</label>
              <input
                type="text"
                placeholder="Enter your fullname"
                value={data.fullname}
                name="fullname"
                required
                onChange={handleData}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                value={data.email}
                name="email"
                required
                onChange={handleData}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Phone Number
              </label>
              <input
                type="text"
                value={data.phone}
                name="phone"
                required
                onChange={handleData}
                placeholder="Enter Phone number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
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
                value={data.password}
                onChange={handleData}
                placeholder="Create a password"
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
                value={"Student"}
                onChange={handleData}
                className=" text-gray-700 font-medium"
                name="role"
              />
              Student
              <input
                className="ml-4  text-gray-700 font-medium"
                type="radio"
                value={"Recruiter"}
                name="role"
                onChange={handleData}
              />
              Recruiter
            </div>
            <div className="flex">
              <label className=" text-gray-700 font-medium">Profile</label>
              <input
                type="file"
                name="filename"
                onChange={handleFileData}
                className="ml-4 border p-1 pl-2 rounded-xl"
              />
            </div>
            {loading ? (
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                loading...
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Signup
              </button>
            )}
          </form>
          <p className="mt-3.5 text-center">
            {" "}
            Already have a account?
            <span className="text-blue-400">
              <Link to="/login">Login</Link>
            </span>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
