import { useState } from "react";
import { supabase } from "../helper/supabaseClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { user, error } = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) console.error(error);
  };

  return (
    <div className="bg-gradient-to-r from-green-200 to-green-400 p-6">
      <h1>Login</h1>
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
      <button onClick={handleLogin}>Login</button>
      <p className="mt-4">
        <a href="/password-reset" className="text-blue-500 hover:underline">
          Forgot your password?
        </a>
      </p>
    </div>
  );
};

export default Login;