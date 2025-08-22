import { useState } from "react";
import { supabase } from "../helper/supabaseClient";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleRegister = async () => {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (user) {
      await supabase.from("profiles").insert({
        id: user.id,
        username,
        avatar,
      });
    }

    if (error) console.error(error);
  };

  return (
    <div className="bg-gradient-to-r from-green-200 to-green-400 p-6">
      <h1>Register</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Avatar URL"
        value={avatar}
        onChange={(e) => setAvatar(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <p className="mt-4">
        <a href="/password-reset" className="text-blue-500 hover:underline">
          Forgot your password?
        </a>
      </p>
    </div>
  );
};

export default Register;