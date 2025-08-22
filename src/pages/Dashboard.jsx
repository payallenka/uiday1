import { useState, useEffect } from "react";
import { supabase } from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";
import { bill, card } from "../assets";
import styles from "../style";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        
        // Get user profile
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileData && !error) {
          setProfile(profileData);
          setNewUsername(profileData.username || "");
          setNewAvatar(profileData.avatar || "");
        } else if (error && !error.message.includes("table") && !error.message.includes("schema")) {
          console.warn("Profile fetch error:", error.message);
          // Create a default profile object if table exists but no profile found
          if (error.code === 'PGRST116') { // No rows returned
            // For OAuth users, try to create a profile with their metadata
            const defaultProfile = {
              id: session.user.id,
              username: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
              avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null
            };
            
            // Try to create the profile
            const { error: createError } = await supabase.from("profiles").upsert(defaultProfile, { onConflict: 'id' });
            
            if (!createError) {
              setProfile(defaultProfile);
              setNewUsername(defaultProfile.username || "");
              setNewAvatar(defaultProfile.avatar || "");
            } else {
              setProfile({ id: session.user.id, username: null, avatar: null });
              setNewUsername("");
              setNewAvatar("");
            }
          }
        } else {
          // Table doesn't exist, use default profile with OAuth data if available
          const defaultProfile = {
            id: session.user.id,
            username: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
            avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null
          };
          setProfile(defaultProfile);
          setNewUsername(defaultProfile.username || "");
          setNewAvatar(defaultProfile.avatar || "");
        }
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/");
    }
  };

  const handleUsernameUpdate = async () => {
    if (!newUsername.trim()) {
      setMessage("Username cannot be empty");
      return;
    }

    setUpdating(true);
    setMessage("");

    try {
      // Use upsert to handle cases where profile doesn't exist yet
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username: newUsername.trim(),
          avatar: profile?.avatar || null
        }, {
          onConflict: 'id'
        });

      if (error) {
        if (error.message.includes("table") || error.message.includes("schema")) {
          setMessage("Profiles table not set up yet. Please contact administrator.");
        } else {
          setMessage(`Error updating username: ${error.message}`);
        }
      } else {
        setProfile({ ...profile, username: newUsername.trim() });
        setEditingUsername(false);
        setMessage("Username updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }

    setUpdating(false);
  };

  const handleAvatarUpdate = async () => {
    setUpdating(true);
    setMessage("");

    try {
      // Validate URL format
      if (newAvatar.trim() && !isValidImageUrl(newAvatar.trim())) {
        setMessage("Please enter a valid direct image URL (ending in .jpg, .png, .gif, or .webp)");
        setUpdating(false);
        return;
      }

      // Use upsert to handle cases where profile doesn't exist yet
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username: profile?.username || null,
          avatar: newAvatar.trim() || null
        }, {
          onConflict: 'id'
        });

      if (error) {
        if (error.message.includes("table") || error.message.includes("schema")) {
          setMessage("Profiles table not set up yet. Please contact administrator.");
        } else {
          setMessage(`Error updating avatar: ${error.message}`);
        }
      } else {
        setProfile({ ...profile, avatar: newAvatar.trim() || null });
        setEditingAvatar(false);
        setMessage("Avatar updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }

    setUpdating(false);
  };

  const isValidImageUrl = (url) => {
    // Check if URL is valid and ends with image extension
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
    } catch {
      return false;
    }
  };

  const cancelEdit = () => {
    setNewUsername(profile?.username || "");
    setNewAvatar(profile?.avatar || "");
    setEditingUsername(false);
    setEditingAvatar(false);
    setMessage("");
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-green-200 to-green-400 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-200 to-green-400 min-h-screen relative overflow-hidden">
      {/* Left side decorative image */}
      <div className="absolute left-4 top-1/3 hidden lg:block">
        <img 
          src={card} 
          alt="card" 
          className="w-44 h-44 bounce-large delay-200 float-animation opacity-15 hover:opacity-30 transition-opacity"
        />
      </div>

      {/* Right side decorative image */}
      <div className="absolute right-4 top-2/3 hidden lg:block">
        <img 
          src={bill} 
          alt="billing" 
          className="w-52 h-52 bounce-large delay-400 float-high opacity-15 hover:opacity-30 transition-opacity"
        />
      </div>

      {/* Additional decorative images */}
      <div className="absolute left-1/4 top-10 hidden xl:block">
        <img 
          src={bill} 
          alt="billing" 
          className="w-28 h-28 bounce-in delay-600 float-high opacity-10"
        />
      </div>

      <div className="absolute right-1/3 bottom-10 hidden xl:block">
        <img 
          src={card} 
          alt="card" 
          className="w-36 h-36 bounce-large delay-800 float-animation opacity-10"
        />
      </div>

      <div className={`${styles.paddingX} ${styles.paddingY} relative z-10`}>
        <div className="max-w-6xl mx-auto">
          {/* Header Card */}
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-8 mb-8 bounce-in delay-300">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">HooBank Dashboard</h1>
                <p className="text-white/90 text-lg drop-shadow-md">Manage your financial future with confidence</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/")}
                  className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all transform hover:scale-105 shadow-lg font-semibold"
                >
                  Home
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/80 backdrop-blur-md border border-red-300/50 text-white px-6 py-3 rounded-xl hover:bg-red-500/90 transition-all transform hover:scale-105 shadow-lg font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-8 mb-8 bounce-in delay-400">
            {message && (
              <div className={`mb-4 p-3 rounded-lg backdrop-blur-md border ${
                message.includes("successfully") 
                  ? "bg-green-500/20 text-green-100 border-green-300/50" 
                  : "bg-red-500/20 text-red-100 border-red-300/50"
              }`}>
                {message}
              </div>
            )}
            
            <div className="flex items-center space-x-8">
              <div className="relative">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-200 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
                    <span className="text-white text-4xl font-bold drop-shadow-lg">
                      {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                
                {/* Avatar Edit Button */}
                <button
                  onClick={() => setEditingAvatar(true)}
                  className="absolute bottom-2 right-2 bg-blue-500/80 backdrop-blur-md border border-blue-300/50 text-white w-8 h-8 rounded-full text-xs font-bold hover:bg-blue-500/90 transition-colors flex items-center justify-center"
                  title="Edit Avatar"
                >
                  📷
                </button>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  {editingUsername ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="text-2xl font-bold text-white border-2 border-white/30 bg-white/10 backdrop-blur-md rounded-lg px-3 py-1 focus:outline-none focus:border-white/50 max-w-xs truncate placeholder-white/70"
                        placeholder="Enter username"
                        maxLength="30"
                      />
                      <button
                        onClick={handleUsernameUpdate}
                        disabled={updating}
                        className="bg-green-500/80 backdrop-blur-md border border-green-300/50 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-green-500/90 disabled:opacity-50"
                      >
                        {updating ? "..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-500/80 backdrop-blur-md border border-gray-300/50 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-gray-500/90"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-3xl font-bold text-white truncate max-w-md drop-shadow-lg" title={profile?.username || "Set Username"}>
                        {profile?.username || "Set Username"}
                      </h2>
                      <button
                        onClick={() => setEditingUsername(true)}
                        className="bg-blue-500/80 backdrop-blur-md border border-blue-300/50 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-blue-500/90 transition-colors"
                      >
                        ✏️ Edit
                      </button>
                    </>
                  )}
                </div>
                <p className="text-white/90 text-lg mb-2 break-all drop-shadow-md" title={user?.email}>{user?.email}</p>
                <p className="text-sm text-white/70 drop-shadow-md">
                  HooBank Member since {new Date(user?.created_at).toLocaleDateString()}
                </p>
                <div className="mt-4">
                  {user?.email_confirmed_at ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/30 text-green-100 border border-green-300/50 backdrop-blur-md">
                      ✓ Verified Account
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/30 text-red-100 border border-red-300/50 backdrop-blur-md">
                      ✗ Email Not Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Avatar Edit Modal */}
            {editingAvatar && (
              <div className="mt-6 p-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-3 drop-shadow-md">Update Avatar</h3>
                <div className="mb-3 text-sm text-white/80">
                  <p className="mb-2">📝 <strong>Supported image URLs:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Direct image links ending in .jpg, .png, .gif, .webp</li>
                    <li>Imgur: i.imgur.com/IMAGE_ID.jpg</li>
                    <li>GitHub: raw.githubusercontent.com/user/repo/main/image.jpg</li>
                  </ul>
                  <p className="mt-2 text-red-300">❌ <strong>Google Drive links will NOT work</strong></p>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="url"
                    value={newAvatar}
                    onChange={(e) => setNewAvatar(e.target.value)}
                    className="flex-1 p-3 border-2 border-white/30 bg-white/10 backdrop-blur-md rounded-lg focus:outline-none focus:border-white/50 text-sm break-all text-white placeholder-white/60"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  <button
                    onClick={handleAvatarUpdate}
                    disabled={updating}
                    className="bg-green-500/80 backdrop-blur-md border border-green-300/50 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-500/90 disabled:opacity-50"
                  >
                    {updating ? "..." : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500/80 backdrop-blur-md border border-gray-300/50 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-500/90"
                  >
                    Cancel
                  </button>
                </div>
                {newAvatar && (
                  <div className="mt-3">
                    <p className="text-sm text-white/80 mb-2">Preview:</p>
                    <div className="flex items-center gap-3">
                      <img
                        src={newAvatar}
                        alt="Avatar Preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                        onLoad={(e) => {
                          e.target.nextSibling.style.display = 'none';
                        }}
                      />
                      <div className="text-red-300 text-sm hidden">
                        ❌ Invalid image URL or image failed to load
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Information Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Account Info Card */}
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-6 bounce-in delay-500 hover:shadow-2xl hover:bg-white/25 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-transparent rounded-lg flex items-center justify-center">
                  <span className="text-blue-300 text-xl font-bold drop-shadow-lg">👤</span>
                </div>
                <h3 className="text-xl font-bold text-white ml-3 drop-shadow-md">Account Details</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Username</label>
                  <p className="text-white font-semibold truncate drop-shadow-md" title={profile?.username || "Not set"}>
                    {profile?.username || "Not set"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
                  <p className="text-white font-semibold break-all text-sm drop-shadow-md" title={user?.email}>
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-6 bounce-in delay-600 hover:shadow-2xl hover:bg-white/25 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-transparent rounded-lg flex items-center justify-center">
                  <span className="text-green-300 text-xl font-bold drop-shadow-lg">🔒</span>
                </div>
                <h3 className="text-xl font-bold text-white ml-3 drop-shadow-md">Security</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Account Status</label>
                  <p className="text-white font-semibold drop-shadow-md">Active</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Email Verification</label>
                  <p className={`font-semibold drop-shadow-md ${user?.email_confirmed_at ? 'text-green-300' : 'text-red-300'}`}>
                    {user?.email_confirmed_at ? "Verified" : "Pending"}
                  </p>
                </div>
              </div>
            </div>

            {/* Authentication Provider Card */}
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-6 bounce-in delay-650 hover:shadow-2xl hover:bg-white/25 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-transparent rounded-lg flex items-center justify-center">
                  <span className="text-yellow-300 text-xl font-bold drop-shadow-lg">
                    {user?.app_metadata?.provider === 'google' ? '🔍' : '📧'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white ml-3 drop-shadow-md">Sign-in Method</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Provider</label>
                  <p className="text-white font-semibold capitalize drop-shadow-md">
                    {user?.app_metadata?.provider === 'google' ? '🔍 Google' : '📧 Email'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Last Sign In</label>
                  <p className="text-white font-semibold text-sm drop-shadow-md">
                    {new Date(user?.last_sign_in_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Account ID Card */}
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-6 bounce-in delay-700 hover:shadow-2xl hover:bg-white/25 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-transparent rounded-lg flex items-center justify-center">
                  <span className="text-purple-300 text-xl font-bold drop-shadow-lg">🆔</span>
                </div>
                <h3 className="text-xl font-bold text-white ml-3 drop-shadow-md">Account ID</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">User ID</label>
                  <p className="text-white text-xs font-mono bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg break-all overflow-hidden" title={user?.id}>
                    {user?.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Message Card */}
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-8 text-center bounce-in delay-800">
            <h2 className="text-3xl font-bold text-white mb-4 break-words drop-shadow-lg">
              Welcome to HooBank, {profile?.username || user?.user_metadata?.full_name || user?.email?.split('@')[0]}! 🎉
            </h2>
            <p className="text-white/90 text-lg opacity-90 max-w-3xl mx-auto mb-4 drop-shadow-md">
              You have successfully logged in to your dashboard. Here you can manage your profile, 
              track your financial goals, and access exclusive HooBank features. Start your journey 
              towards financial freedom today!
            </p>
            {user?.app_metadata?.provider === 'google' && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3 text-white text-sm">
                <span className="font-semibold drop-shadow-md">✅ Signed in with Google</span>
                <p className="mt-1 opacity-90 drop-shadow-md">Your profile information has been imported from your Google account.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;