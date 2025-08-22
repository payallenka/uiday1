import { supabase } from "../helper/supabaseClient";

const Logout = () => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
  };

  return (
    <div className="bg-gradient-to-r from-green-200 to-green-400 p-6">
      <h1>Logout</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;