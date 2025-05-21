import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { client } from "../../sanity"


export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [adminCreds, setAdminCreds] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
    useEffect(() => {
    const fetchCreds = async () => {
      const creds = await client.fetch(`*[_type == "adminSettings"][0]`);
      setAdminCreds(creds);
    };
    fetchCreds();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      form.email === adminCreds.email &&
      form.password === adminCreds.password
    ) {
      onLogin(); 
      navigate("/admin"); 
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Admin Login</h2>
        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
}
