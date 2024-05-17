import AuthContext from "@/context/Authentication/AuthContext";
import ContestContext from "@/context/Contests/ConstesContext";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const AdminDashboard = () => {
  const router = useRouter();
  const [contestId, setContestId] = useState(null);
  const { user, fetchUser } = useContext(AuthContext);
  const { contests, getAllContestsByOwner } = useContext(ContestContext);

  useEffect(() => {
    if (router.query) setContestId(router.query.contest);
  }, [router.query]);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      {contestId && (
        <iframe
          src={`http://localhost:3000/d/d273ea68-0ee9-4a9c-9431-76915bcef5fb/contest-admin-dashboard?orgId=1&theme=light&from=now-24h&to=now`}
          width="100%"
          height="100%"
          style={{ position: "absolute", top: "-75px" }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
