import { useState, useEffect } from "react";
import { supabase } from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";

const SetNewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for password recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (event === 'PASSWORD_RECOVERY') {
          console.log('Password recovery event detected');
          setTokenValid(true);
          setMessage("Password recovery verified! You can now set your new password.");
        } else if (event === 'SIGNED_IN' && session) {
          // Only set valid if this is a recovery session (check URL for recovery type)
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const type = hashParams.get('type');
          
          if (type === 'recovery') {
            console.log('Recovery session detected');
            setTokenValid(true);
            setMessage("Token verified! You can now set your new password.");
          } else {
            console.log('Regular sign in detected, checking for existing recovery session');
            // Check if user already has a valid session that can reset password
            setTokenValid(true);
            setMessage("Token verified! You can now set your new password.");
          }
        }
      }
    );

    // Also check current session for existing recovery tokens
    const checkSession = async () => {
      try {
        console.log('Checking initial session and URL...');
        
        // First check URL for recovery tokens
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        console.log('URL params:', { hasAccessToken: !!accessToken, type });
        
        if (accessToken && type === 'recovery') {
          console.log('Setting recovery session from URL...');
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (data.session && !error) {
            setTokenValid(true);
            setMessage("Token verified! You can now set your new password.");
            // Clear the URL hash after setting session
            window.history.replaceState(null, '', window.location.pathname);
          } else {
            console.error('Error setting session:', error);
            setTokenValid(false);
            setMessage("Invalid or expired reset token. Please request a new password reset.");
          }
        } else {
          // Check if there's already a valid session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (session && session.user) {
            console.log('Existing session found');
            setTokenValid(true);
            setMessage("Token verified! You can now set your new password.");
          } else {
            console.log('No valid session or recovery token found');
            setTokenValid(false);
            setMessage("No reset token found. Please request a new password reset.");
          }
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setTokenValid(false);
        setMessage("Error verifying reset token. Please try again.");
      }
    };

    checkSession();

    return () => subscription.unsubscribe();
  }, []);

  const handleSetNewPassword = async () => {
    if (!tokenValid) {
      setMessage("Invalid session. Please request a new password reset.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) {
        setMessage(`Error updating password: ${error.message}`);
      } else {
        setMessage("Password updated successfully! Signing you out...");
        
        // Sign out the user and redirect to login
        await supabase.auth.signOut();
        
        setTimeout(() => {
          navigate("/auth");
        }, 2000);
      }
    } catch (err) {
      setMessage("Error updating password. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-green-400 p-6">
      <div className="bg-white rounded-xl shadow-2xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Set Your New Password</h1>
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("successfully") || message.includes("verified")
              ? "bg-green-100 text-green-700 border border-green-200" 
              : "bg-red-100 text-red-700 border border-red-200"
          }`}>
            {message}
          </div>
        )}

        {tokenValid ? (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-green-500 focus:border-transparent transition-all text-lg"
              minLength="6"
              required
            />
            <input
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-green-500 focus:border-transparent transition-all text-lg"
              minLength="6"
              required
            />
            <button
              onClick={handleSetNewPassword}
              disabled={loading || !password || !confirmPassword}
              className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white p-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-green-500 to-green-700 text-white py-3 px-6 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetNewPassword;
