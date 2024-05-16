import AuthContext from "@/context/Authentication/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";

const Navbar = () => {
  const { user, logout, fetchUser } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const NavLink = ({ route, name }) => {
    return (
      <li className="nav-item">
        <Link
          className={`nav-link ${router.route === route ? "active" : ""}`}
          href={route}
        >
          {name}
        </Link>
      </li>
    );
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary"
      style={{ zIndex: 1000 }}
    >
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <NavLink route={"/"} name={"Home"} />
            <NavLink route={"/contests"} name={"Contests"} />
            {/* <NavLink route={"/profile"} name={"Profile"} /> */}
            {user && user.role === "admin" && (
              <NavLink route={"/dashboard/admin"} name={"Admin Dashboard"} />
            )}
          </ul>
          {user ? (
            <button className="btn btn-outline-primary" onClick={logout}>
              Logout
            </button>
          ) : (
            <>
              <Link className="btn btn-outline-primary m-1" href="/auth/login">
                Login
              </Link>
              <Link className="btn btn-outline-primary m-1" href="/auth/signup">
                SignUp
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
