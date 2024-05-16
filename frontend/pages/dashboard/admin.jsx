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
          src={`http://localhost:3000/public-dashboards/16185a1e6e654cdeb63aba30bc37e847?theme=light&from=now-24h&to=now`}
          width="100%"
          height="100%"
          style={{ position: "absolute", top: "-12px" }}
        />
      </div>
    )
  );
};

export default AdminDashboard;
