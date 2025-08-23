import { useState } from "react";
import { supabase } from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";
import { bill, card } from "../assets";
import styles from "../style";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Validate username
  const isValidUsername = (username) => {
    return username && 
           username.length >= 3 && 
           username.length <= 30 && 
           /^[a-zA-Z0-9_]+$/.test(username); // Allow letters, numbers, and underscores only
  };

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage(`Login failed: ${error.message}`);
        } else {
          setMessage("Login successful!");
          setTimeout(() => navigate("/dashboard"), 1500);
        }
      } else {
        // Register - validate required fields
        if (!isValidUsername(username)) {
          setMessage("Please enter a valid username (3-30 characters, letters, numbers, and underscores only)");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setMessage(`Registration failed: ${error.message}`);
        } else if (data.user) {
          // Show immediate feedback
          setMessage("Creating your account and setting up profile...");
          
          // Function to update profile with retry logic
          const updateProfile = async (retries = 3) => {
            try {
              console.log(`Attempting to save profile - Username: "${username.trim()}", Avatar: "${avatar.trim() || 'none'}"`);
              
              // First try to upsert (insert or update) the profile
              const { error: upsertError } = await supabase
                .from("profiles")
                .upsert({
                  id: data.user.id,
                  username: username.trim(),
                  avatar: avatar.trim() || null,
                }, {
                  onConflict: 'id'
                });

              if (upsertError) {
                console.warn("Upsert failed, trying update:", upsertError.message);
                // If upsert fails, try to update existing profile
                const { error: updateError } = await supabase
                  .from("profiles")
                  .update({
                    username: username.trim(),
                    avatar: avatar.trim() || null,
                  })
                  .eq('id', data.user.id);

                if (updateError && retries > 0) {
                  console.warn(`Update failed, retrying in 500ms. Retries left: ${retries - 1}`);
                  // Retry after a short delay
                  setTimeout(() => updateProfile(retries - 1), 500);
                  return;
                } else if (updateError) {
                  console.warn("Profile update error:", updateError.message);
                  if (!updateError.message.includes("table") && !updateError.message.includes("schema")) {
                    setMessage(`Profile setup failed: ${updateError.message}`);
                    return;
                  }
                }
              } else {
                console.log("Profile saved successfully!");
              }
              
              setMessage("Registration successful! Your profile has been created. Please check your email to verify your account.");
              setTimeout(() => {
                setMessage("Redirecting to dashboard...");
                navigate("/dashboard");
              }, 2000);
            } catch (err) {
              console.warn("Profile setup error:", err);
              if (retries > 0) {
                console.warn(`Retrying profile creation. Retries left: ${retries - 1}`);
                setTimeout(() => updateProfile(retries - 1), 500);
              } else {
                setMessage("Registration successful! Please check your email to verify your account. Profile will be set up on first login.");
                setTimeout(() => navigate("/dashboard"), 1500);
              }
            }
          };

          // Start profile update process
          updateProfile();
        }
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }

    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Always use the current origin for OAuth redirect
      const redirectUrl = `${window.location.origin}/dashboard`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) {
        setMessage(`Google authentication failed: ${error.message}`);
        setLoading(false);
      }
      // Note: For OAuth, the user will be redirected to Google, so we don't handle success here
    } catch (err) {
      setMessage(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Always use the current origin for password reset
      const redirectUrl = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("Password reset email sent! Check your inbox.");
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }

    setLoading(false);
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setAvatar("");
    setMessage("");
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsResetMode(false);
    clearForm();
  };

  const toggleResetMode = () => {
    setIsResetMode(!isResetMode);
    clearForm();
  };

  return (
    <div className="bg-neutral-900 min-h-screen flex items-center justify-center relative overflow-hidden text-white">
      {/* Left side decorative image */}
      <div className="absolute left-8 top-1/4 hidden lg:block">
        <img 
          src={bill} 
          alt="billing" 
          className="w-48 h-48 bounce-large delay-200 float-high opacity-20 hover:opacity-40 transition-opacity"
        />
        {/* gradient start */}
        <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient opacity-30" />
        <div className="absolute z-[0] w-[50%] h-[50%] -left-1/2 bottom-0 rounded-full pink__gradient opacity-30" />
        {/* gradient end */}
      </div>

      {/* Right side decorative image */}
      <div className="absolute right-8 top-3/4 hidden lg:block">
        <img 
          src={card} 
          alt="card" 
          className="w-40 h-40 bounce-large delay-500 float-animation opacity-20 hover:opacity-40 transition-opacity"
        />
        {/* gradient start */}
        <div className="absolute z-[3] -right-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient opacity-30" />
        <div className="absolute z-[0] w-[50%] h-[50%] -right-1/2 bottom-0 rounded-full pink__gradient opacity-30" />
        {/* gradient end */}
      </div>

      {/* Additional smaller images for randomness */}
      <div className="absolute left-1/4 top-16 hidden xl:block">
        <img 
          src={card} 
          alt="card" 
          className="w-24 h-24 bounce-in delay-700 float-animation opacity-15"
        />
      </div>

      <div className="absolute right-1/4 bottom-16 hidden xl:block">
        <img 
          src={bill} 
          alt="billing" 
          className="w-32 h-32 bounce-large delay-900 float-high opacity-15"
        />
      </div>

      <div className={`${styles.paddingX} w-full max-w-2xl z-10 relative`}>
        <div className="bg-neutral-800 rounded-xl shadow-2xl p-10 backdrop-blur-lg bg-opacity-95">
          <h1 className="text-4xl font-bold text-center mb-8 text-white bounce-in delay-300">
            {isResetMode ? "Reset Password" : (isLogin ? "Welcome Back" : "Join HooBank")}
          </h1>
          
          {message && (
            <div className={`mb-6 p-4 rounded-lg bounce-in delay-400 ${
              message.includes("successful") || message.includes("Please check") || message.includes("sent")
                ? "bg-neutral-700 text-green-300 border border-green-700" 
                : "bg-neutral-700 text-red-300 border border-red-700"
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-6">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-neutral-700 bg-neutral-900 text-white rounded-xl focus:outline-none focus:ring-3 focus:ring-primary focus:border-transparent transition-all text-lg placeholder:text-neutral-400"
              required
            />
            
            {!isResetMode && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-neutral-700 bg-neutral-900 text-white rounded-xl focus:outline-none focus:ring-3 focus:ring-primary focus:border-transparent transition-all text-lg placeholder:text-neutral-400"
                required
              />
            )}

            {!isLogin && !isResetMode && (
              <>
                <input
                  type="text"
                  placeholder="Username (required)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-3 transition-all text-lg ${
                    !isLogin && username && !isValidUsername(username)
                      ? 'border-red-700 bg-neutral-900 text-white focus:ring-red-500 focus:border-transparent placeholder:text-neutral-400'
                      : 'border-neutral-700 bg-neutral-900 text-white focus:ring-primary focus:border-transparent placeholder:text-neutral-400'
                  }`}
                  required
                  minLength="3"
                  maxLength="30"
                />
                {!isLogin && username && !isValidUsername(username) && (
                  <p className="text-red-500 text-sm mt-1">
                    Username must be 3-30 characters and contain only letters, numbers, and underscores
                  </p>
                )}
                
                <input
                  type="url"
                  placeholder="Avatar URL (optional)"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full p-4 border border-neutral-700 bg-neutral-900 text-white rounded-xl focus:outline-none focus:ring-3 focus:ring-primary focus:border-transparent transition-all text-lg placeholder:text-neutral-400"
                />
              </>
            )}

            <button
              onClick={isResetMode ? handlePasswordReset : handleAuth}
              disabled={loading || !email || (isResetMode ? false : !password) || (!isLogin && !isResetMode && (!username || !isValidUsername(username)))}
              className="w-full bg-neutral-700 text-white p-4 rounded-xl font-bold text-lg hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
            >
              {loading ? "Processing..." : (isResetMode ? "Send Reset Email" : (isLogin ? "Sign In" : "Create Account"))}
            </button>

            {!isResetMode && (
              <>
                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-neutral-700"></div>
                  <span className="px-4 text-neutral-400 bg-neutral-800">OR</span>
                  <div className="flex-1 border-t border-neutral-700"></div>
                </div>

                {/* Google Auth Button */}
                <button
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full bg-neutral-900 border-2 border-neutral-700 text-white p-4 rounded-xl font-bold text-lg hover:bg-neutral-800 hover:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </>
            )}

            {/* Auth Mode Toggle */}
            <div className="text-center text-neutral-400">
              {isResetMode ? (
                <p>
                  Remember your password?{" "}
                  <button
                    onClick={toggleResetMode}
                    className="text-primary hover:text-primary-foreground font-semibold underline"
                  >
                    Back to Sign In
                  </button>
                </p>
              ) : (
                <>
                  <p>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                      onClick={toggleMode}
                      className="text-green-600 hover:text-green-800 font-semibold underline"
                    >
                      {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                  </p>
                  {isLogin && (
                    <p className="mt-2">
                      <button
                        onClick={toggleResetMode}
                        className="text-primary hover:text-primary-foreground font-semibold underline"
                      >
                        Forgot your password?
                      </button>
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
