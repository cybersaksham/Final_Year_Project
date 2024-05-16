import Contest from "@/components/Contest";
import Loader from "@/components/Loader";
import AuthContext from "@/context/Authentication/AuthContext";
import ContestContext from "@/context/Contests/ConstesContext";
import { useContext, useEffect } from "react";
import NewContest from "@/components/NewContest";

export default function MyContests() {
  const { user, fetchUser } = useContext(AuthContext);
  const { contests, getMyContests } = useContext(ContestContext);

  useEffect(() => {
    fetchUser();
    getMyContests();
  }, []);

  return user && contests ? (
    <div className="container">
      <h3>Managed Contests</h3>
      <NewContest />
      <div className="d-flex flex-wrap justify-content-between">
        {Array.from(contests).map(
          (ch) =>
            ch.isManager && (
              <Contest key={ch._id} contest={ch} badge={"Registered"} />
            )
        )}
      </div>
    </div>
  ) : (
    <Loader />
  );
}
