import Link from "next/link";
import React, { useState } from "react";
import { useContext } from "react";
import AuthContext from "@/context/Authentication/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useContext(AuthContext);

  const handleLogin = (event) => {
    event.preventDefault();
    loginUser({ email, password });
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-90">
      <div className="card shadow-lg">
        {/* <div className="card-header">
          <h1 className="card-title text-center">CTF Login</h1>
        </div> */}
        <div className="card-body">
          <form action="/" onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                required={true}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                required={true}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
              <Link href="/auth/signup" className="btn btn-link">
                Don't have an account?
              </Link>
              {/* <a href="/forgot-password" className="btn btn-link">
                Forgot Password?
              </a> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
