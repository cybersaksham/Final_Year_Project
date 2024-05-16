import AuthContext from "@/context/Authentication/AuthContext";
import Link from "next/link";
import React, { useContext, useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCpassword] = useState("");
  const { registerUser } = useContext(AuthContext);

  const handleSignup = (event) => {
    event.preventDefault();
    registerUser({ username, email, password, cPassword });
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-90">
      <div className="card shadow-lg">
        {/* <div className="card-header">
          <h1 className="card-title text-center">CTF Login</h1>
        </div> */}
        <div className="card-body">
          <form action="/" onSubmit={handleSignup}>
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
              <label htmlFor="email" className="form-label">
                Username:
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                required={true}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
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
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Confirm Password:
              </label>
              <input
                type="text"
                className="form-control"
                id="cpassword"
                name="cpassword"
                required={true}
                value={cPassword}
                onChange={(e) => {
                  setCpassword(e.target.value);
                }}
              />
            </div>
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                Create Account
              </button>
              <Link href="/auth/login" className="btn btn-link">
                Already have an account?
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
