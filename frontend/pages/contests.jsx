import Contest from "@/components/Contest";
import Loader from "@/components/Loader";
import AuthContext from "@/context/Authentication/AuthContext";
import ContestContext from "@/context/Contests/ConstesContext";
import { useContext, useEffect, useState } from "react";
import NewContest from "@/components/NewContest";

export default function MyContests() {
  const { user, fetchUser } = useContext(AuthContext);
  const { contests, getAllContests } = useContext(ContestContext);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    fetchUser();
    getAllContests();
  }, []);

  const CreateTab = ({ index, name }) => {
    return (
      <li className="nav-item">
        <a
          className={`nav-link${tabIndex === index ? " active" : ""}`}
          aria-current="page"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setTabIndex(index);
          }}
        >
          {name}
        </a>
      </li>
    );
  };

  return user && contests ? (
    <div>
      <NewContest />
      <ul className="nav nav-tabs">
        <CreateTab index={0} name={"All"} />
        <CreateTab index={1} name={"Managed"} />
        <CreateTab index={2} name={"Registered"} />
        <CreateTab index={3} name={"Completed"} />
      </ul>
      <div className="container mt-5">
        <NewContest />
        <div className="d-flex flex-wrap justify-content-between">
          {Array.from(contests).map(
            (ch) =>
              (tabIndex === 0
                ? !ch.completed
                : tabIndex === 1
                ? (ch.isOwner || ch.isManager) && !ch.completed
                : tabIndex === 2
                ? ch.isRegistered && !ch.completed
                : ch.completed) && <Contest key={ch._id} contest={ch} />
          )}
        </div>
      </div>
    </div>
  ) : (
    <Loader />
  );
}
