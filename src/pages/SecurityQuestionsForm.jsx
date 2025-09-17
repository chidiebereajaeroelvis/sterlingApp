// Frontend - SecurityQuestionsForm.js with debug logging
import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../components/urls";
import logo from "../assets/logo.png";

const questionsList = [
  "What is your father's middle name?",
  "What is your favourite colour?",
  "When did you get your first mobile phone?",
  "What is your pet name?",
  "What is the model of your first car?",
  "How do you know about Sterling Bank Plc?",
  "What is your hobby?",
  "Where is your mother's home town?",
  "What is your mother's maiden name?",
  "What is your spouse's middle name?",
  "Which town or city did your parents get married?",
  "What is the name of your favourite teacher?",
  "Who is your role model?",
];

const SecurityQuestionsForm = () => {
  // Initialize with 3 security questions
  const [formData, setFormData] = useState([
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" }
  ]);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (index, field, value) => {
    const updated = [...formData];
    updated[index][field] = value;
    setFormData(updated);
    console.log(`Updated form data at index ${index}, field ${field}:`, updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Current form data:", formData);
    console.log("BASE_URL:", BASE_URL);
    
    // Validate all questions are selected and answered
    const isValid = formData.every(item => item.question && item.answer.trim());
    console.log("Form validation result:", isValid);
    
    if (!isValid) {
      console.log("Validation failed - missing data:");
      formData.forEach((item, index) => {
        console.log(`Item ${index + 1}:`, {
          hasQuestion: !!item.question,
          hasAnswer: !!item.answer?.trim(),
          question: item.question,
          answer: item.answer
        });
      });
      alert("Please fill in all security questions and answers");
      return;
    }

    setLoading(true);
    
    const payload = { questions: formData };
    console.log("Payload being sent:", JSON.stringify(payload, null, 2));
    console.log("Request URL:", `${BASE_URL}/security`);
    
    try {
      console.log("Making API request...");
      const response = await axios.post(`${BASE_URL}/security`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("API Response:", response);
      console.log("Response data:", response.data);
      console.log("Response status:", response.status);
      
      // Reset form after successful submission
      setFormData([
        { question: "", answer: "" },
        { question: "", answer: "" },
        { question: "", answer: "" }
      ]);
      
      alert("Security questions submitted successfully!");
      
    } catch (err) {
      console.error("=== SUBMISSION FAILED ===");
      console.error("Error object:", err);
      console.error("Error message:", err.message);
      console.error("Error response:", err.response);
      
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
        console.error("Response headers:", err.response.headers);
      } else if (err.request) {
        console.error("Request made but no response:", err.request);
      }
      
      const errorMessage = err.response?.data?.error || err.message || "Unknown error occurred";
      alert(`Submission failed: ${errorMessage}`);
    } finally {
      setLoading(false);
      console.log("=== FORM SUBMISSION ENDED ===");
    }
  };

  // Test connection function
  const testConnection = async () => {
    try {
      console.log("Testing server connection...");
      const response = await axios.get(`${BASE_URL}/test`);
      console.log("Connection test successful:", response.data);
      alert("Server connection successful!");
    } catch (err) {
      console.error("Connection test failed:", err);
      alert("Server connection failed!");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 px-2">
      <div className="w-full max-w-md bg-white p-5">
        <div className="flex justify-end mb-6">
          <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
        </div>
        
        {/* Debug button for testing connection */}
        <button
          type="button"
          onClick={testConnection}
          className="w-full mb-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700"
        >
          Test Server Connection
        </button>
        
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Set Security Questions
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          It is important you remember your secret questions.
          You will need them if you ever forgot your password.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.map((item, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Security Question {index + 1}
              </label>
              <div className="relative">
                <select
                  value={item.question}
                  onChange={(e) =>
                    handleChange(index, "question", e.target.value)
                  }
                  className="block w-full appearance-none bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>
                    Select a security question
                  </option>
                  {questionsList.map((q, idx) => (
                    <option
                      key={idx}
                      value={q}
                      disabled={formData.some(
                        (f, i) => f.question === q && i !== index
                      )}
                    >
                      {q}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  ▼
                </span>
              </div>
              <input
                type="text"
                value={item.answer}
                onChange={(e) => handleChange(index, "answer", e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your answer"
                required
                autoComplete="off"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecurityQuestionsForm;
