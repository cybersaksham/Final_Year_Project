import AuthContext from "@/context/Authentication/AuthContext";
import React, { useContext, useEffect } from "react";

const AdminDashboard = () => {
  const { user, fetchUser } = useContext(AuthContext);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    user &&
    user.role === "admin" && (
      <div style={{ height: "100vh" }}>
        <iframe
          src={`http://localhost:3000/public-dashboards/1834d004b5504a93ac0ded845728bb3b?orgId=1&from=now-24h&to=now&theme=light`}
          width="100%"
          height="100%"
          style={{ position: "absolute", top: "-12px" }}
        />
      </div>
    )
  );
};

export default AdminDashboard;
