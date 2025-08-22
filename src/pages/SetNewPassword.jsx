import { useState } from "react";
import { supabase } from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";

const SetNewPassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSetNewPassword = async () => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage("Error updating password. Please try again.");
    } else {
      setMessage("Password updated successfully! Redirecting to homepage...");
      // Redirect to homepage after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-green-400">
      <h1 className="text-3xl font-bold mb-6">Set Your New Password</h1>
      <input
        type="password"
        placeholder="Enter your new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-3 rounded-lg border border-gray-300 mb-4 w-80"
      />
      <button
        onClick={handleSetNewPassword}
        className="py-2 px-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg shadow-lg font-semibold transition-all duration-300 ease-in-out hover:from-green-700 hover:to-green-800 hover:shadow-xl"
      >
        Update Password
      </button>
      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
};

export default SetNewPassword;
