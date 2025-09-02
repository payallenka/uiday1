import { RiUserLine, RiShieldLine, RiGoogleFill, RiMailLine, RiIdCardLine, RiCameraLine, RiEditLine, RiFileTextLine, RiCheckboxCircleLine, RiCloseCircleLine } from '@remixicon/react';
import { useState, useEffect } from "react";
import { supabase } from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";
import { bill, card } from "../assets";
import styles from "../style";
import Button from "../components/Button";
import GitHubRepoWidget from "../components/GitHubRepoWidget";
import StockMarketWidget from "../components/StockMarketWidget";
import ChatbotWidget from "../components/ChatbotWidget";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingUsername, setEditingUsername] = useState(false);
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#000' }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <section className="py-16 px-4 min-h-screen overflow-x-hidden" style={{ backgroundColor: '#000' }}>
        <div className="max-w-5xl mx-auto text-white">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12">
            <h2 className="text-4xl font-bold text-center md:text-left mb-6 md:mb-0 drop-shadow-lg">
              Dashboard
            </h2>
            <div className="flex gap-4 justify-center md:justify-end">
              <Button styles="px-6 py-3" onClick={() => navigate("/")}>Home</Button>
              <Button styles="px-6 py-3 bg-red-600 border-red-700 hover:bg-red-700" onClick={handleLogout}>Logout</Button>
            </div>
          </div>

          {message && (
            <div className={`flex items-center gap-2 mb-6 p-4 rounded-lg ${
              message.includes("successfully")
                ? "bg-green-600/20 text-green-400"
                : "bg-red-600/20 text-red-400"
            }`}>
              {message.includes("successfully") ? (
                <RiCheckboxCircleLine className="w-5 h-5" />
              ) : (
                <RiCloseCircleLine className="w-5 h-5" />
              )}
              <span>{message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 mb-8">
            {/* Account Details Card */}
            <div className="bg-neutral-800/80 backdrop-blur-lg border border-neutral-700 rounded-2xl p-8 shadow-lg">
              <h3 className="flex items-center gap-2 text-2xl font-semibold mb-6">
                <RiUserLine className="w-6 h-6 opacity-80" />
                Account Details
              </h3>
              <div className="flex items-center gap-4 mb-6">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-4 border-green-200 shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-neutral-700/60 backdrop-blur-md border border-neutral-600 flex items-center justify-center shadow-lg">
                    <span className="text-white text-3xl font-bold drop-shadow-lg">
                      {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <p className="flex items-center gap-2 mb-2">
                <RiIdCardLine className="w-5 h-5 opacity-80" /> ID: {user?.id}
              </p>
              <p className="flex flex-wrap items-center gap-2 mb-2">
                <RiUserLine className="w-5 h-5 opacity-80" /> Username: {profile?.username || "Not set"}
                {editingUsername ? (
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="text-base font-bold text-white border-2 border-white/30 bg-white/10 backdrop-blur-md rounded-lg px-2 py-1 focus:outline-none focus:border-white/50 max-w-xs truncate placeholder-white/70"
                      placeholder="Enter username"
                      maxLength="30"
                    />
                    <button
                      onClick={handleUsernameUpdate}
                      disabled={updating}
                      className="bg-green-500/80 backdrop-blur-md border border-green-300/50 text-white px-2 py-1 rounded-lg text-xs font-semibold hover:bg-green-500/90 disabled:opacity-50 flex items-center gap-1"
                    >
                      {updating ? "..." : <><RiCheckboxCircleLine size={14} /> Save</>}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-500/80 backdrop-blur-md border border-gray-300/50 text-white px-2 py-1 rounded-lg text-xs font-semibold hover:bg-gray-500/90 flex items-center gap-1"
                    >
                      <RiEditLine size={14} /> Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingUsername(true)}
                    className="ml-2 bg-blue-500/80 backdrop-blur-md border border-blue-300/50 text-white px-2 py-1 rounded-lg text-xs font-semibold hover:bg-blue-500/90 transition-colors flex items-center gap-1"
                  >
                    <RiEditLine size={14} /> Edit
                  </button>
                )}
              </p>
              <p className="flex items-center gap-2">
                <RiMailLine className="w-5 h-5 opacity-80" /> Email: {user?.email}
              </p>
              <p className="flex items-center gap-2 mb-2">
                <RiShieldLine className="w-5 h-5 opacity-80" /> Email Verification: {user?.email_confirmed_at ? "Enabled" : "Disabled"}
              </p>
              <p className="flex items-center gap-2 mb-2">
                <RiFileTextLine className="w-5 h-5 opacity-80" /> Last Sign In: {new Date(user?.last_sign_in_at).toLocaleDateString()}
              </p>
              <p className="text-xs text-white/70 mt-2">
                HooBank Member since {new Date(user?.created_at).toLocaleDateString()}
              </p>
              <div className="mt-4">
                {user?.email_confirmed_at ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/30 text-green-100 border border-green-300/50 backdrop-blur-md gap-1">
                    <RiCheckboxCircleLine size={16} /> Verified Account
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/30 text-red-100 border border-red-300/50 backdrop-blur-md gap-1">
                    <RiCloseCircleLine size={16} /> Email Not Verified
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* GitHub Repo Widget */}
            <GitHubRepoWidget />
            {/* Stock Market Widget */}
            {user && <StockMarketWidget symbol="AAPL" userId={user.id} />}
          </div>
        </div>
      </section>
      {/* Floating Chatbot Widget, always visible */}
      <ChatbotWidget />
    </>
  );
};

export default Dashboard;