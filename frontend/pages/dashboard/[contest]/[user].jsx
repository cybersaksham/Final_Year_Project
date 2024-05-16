import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const router = useRouter();
  const [contestId, setContestId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (router.query) {
      setContestId(router.query.contest);
      setUsername(router.query.user);
    }
  }, [router.query]);

  return (
    <div style={{ height: "100vh" }}>
      {contestId && (
        <iframe
          src={`http://localhost:3000/d/e610dc6e-032e-4512-934a-b77dad560488/user-dashboard?orgId=1&from=now-24h&to=now&var-contest_name=${contestId}&username=${username}&theme=light`}
          width="100%"
          height="100%"
          style={{ position: "absolute", top: "-75px" }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
