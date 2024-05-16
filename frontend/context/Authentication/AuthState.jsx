import React, { useState } from "react";
import { useRouter } from "next/router";
import useRequest from "../../Hooks/Request";
import AuthContext from "./AuthContext";

const AuthState = (props) => {
  const HOST = process.env.NEXT_PUBLIC_BACKEND_URI + "/user";

  const checkRequest = useRequest();
  const router = useRouter();

  const [user, setUser] = useState(null);

  // Logging In
  const loginUser = async ({ email, password }) => {
    try {
      const response = await fetch(HOST + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const json = await response.json();
      checkRequest(
        response.status,
        json.error,
        "Logged in successfully",
        () => {
          localStorage.setItem("token", JSON.stringify(json.token));
          router.push("/");
        }
      );
    } catch (e) {
      checkRequest(404, "Try Again", null, () => {});
    }
  };

  // Registering
  const registerUser = async ({ username, email, password, cPassword }) => {
    try {
      if (password === cPassword) {
        const response = await fetch(HOST, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        });
        const json = await response.json();
        checkRequest(
          response.status,
          json.error,
          "Registered successfully",
          () => {
            localStorage.setItem("token", JSON.stringify(json.token));
            router.push("/");
          }
        );
      } else {
        checkRequest(404, "Passwords do not match", "", () => {});
      }
    } catch (e) {
      checkRequest(404, "Try Again", null, () => {});
    }
  };

  // Check User
  const checkUser = async () => {
    try {
      let token = await JSON.parse(localStorage.getItem("token"));
      if (!token) {
        checkRequest(404, "Session timeout", null, () => {
          router.push("/auth/login");
          setUser(null);
        });
      }
    } catch (e) {
      checkRequest(404, "Try Again", null, () => {});
    }
  };

  // Fetch User
  const fetchUser = async () => {
    try {
      let token = await JSON.parse(localStorage.getItem("token"));
      if (!token) {
        checkRequest(404, "Session timeout", null, () => {
          router.push("/auth/login");
          setUser(null);
        });
      } else {
        const response = await fetch(HOST + "/fetch", {
          method: "POST",
          headers: {
            "auth-token": token,
          },
        });
        const json = await response.json();
        checkRequest(response.status, null, null, () => {
          setUser(json);
        });
      }
    } catch (e) {
      checkRequest(404, "Try Again", null, () => {
        router.push("/auth/login");
        setUser(null);
      });
    }
  };

  // Logout
  const logout = async () => {
    try {
      localStorage.removeItem("token");
      checkRequest(200, null, "Logged out successfully", () => {
        setUser(null);
        router.push("/auth/login");
      });
    } catch (e) {
      checkRequest(404, "Try Again", null, () => {});
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loginUser, registerUser, fetchUser, checkUser, logout }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
