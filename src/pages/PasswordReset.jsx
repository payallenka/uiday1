import { useState } from "react";
import { supabase } from "../helper/supabaseClient";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password",
    });

    if (error) {
      setMessage("Error sending password reset email. Please try again.");
    } else {
      setMessage("Password reset email sent successfully!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-green-400">
      <h1 className="text-3xl font-bold mb-6">Reset Your Password</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-3 rounded-lg border border-gray-300 mb-4 w-80"
      />
      <button
        onClick={handlePasswordReset}
        className="py-2 px-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg shadow-lg font-semibold transition-all duration-300 ease-in-out hover:from-green-700 hover:to-green-800 hover:shadow-xl"
      >
        Send Reset Email
      </button>
      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
};

export default PasswordReset;
