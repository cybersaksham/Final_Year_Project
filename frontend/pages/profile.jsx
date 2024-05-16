import React, { useContext, useEffect } from "react";
import AuthContext from "@/context/Authentication/AuthContext";
import Loader from "@/components/Loader";

const Profile = () => {
  const { user, fetchUser, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchUser();
  }, []);

  return user ? (
    <div className="container">
      <div>
        <span>
          <strong>Email: </strong>
        </span>
        <span>{user.email}</span>
      </div>
      <div>
        <span>
          <strong>Username: </strong>
        </span>
        <span>{user.username}</span>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default Profile;
