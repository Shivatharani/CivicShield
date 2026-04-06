"use client";

import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!email.includes("@")) {
      return "Invalid email";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return null;
  };

  const login = async () => {
    const err = validate();

    if (err) {
      setError(err);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", {
        username: email,
        password
      });

      localStorage.setItem("token", res.data.token);

      window.location.href = "/admin";

    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <div className="bg-white shadow-lg p-8 rounded w-96">

        <h2 className="text-xl font-bold mb-6 text-center">
          Login
        </h2>

        {/* EMAIL */}
        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <div className="relative mb-3">
          <input
            type={show ? "text" : "password"}
            className="border p-2 w-full"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setShow(!show)}
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-red-500 mb-3 text-sm">
            {error}
          </div>
        )}

        {/* LOGIN BUTTON */}
        <button
          onClick={login}
          className="bg-blue-600 text-white w-full py-2 rounded mb-4"
        >
          Login
        </button>

        {/* GOOGLE LOGIN */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await axios.post(
                  "http://localhost:5000/google-login",
                  { credential: credentialResponse.credential }
                );

                localStorage.setItem("token", res.data.token);
                window.location.href = "/admin";

              } catch {
                alert("Google login failed");
              }
            }}
          />
        </div>

      </div>
    </div>
  );
}