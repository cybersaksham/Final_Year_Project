import CreateChallenge from "@/components/CreateChallenge";
import EditManagers from "@/components/EditManagers";
import Loader from "@/components/Loader";
import AuthContext from "@/context/Authentication/AuthContext";
import ContestContext from "@/context/Contests/ConstesContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const ContestPage = () => {
  const router = useRouter();
  const [id, setId] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const {
    contest,
    participations,
    getById,
    getParticipations,
    participate,
    markCompleted,
  } = useContext(ContestContext);
  const { user, fetchUser } = useContext(AuthContext);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (router.query) setId(router.query.id);
  }, [router.query]);

  useEffect(() => {
    if (id) {
      getById(id);
      getParticipations(id);
    }
  }, [id]);

  useEffect(() => {
    if (contest && user) {
      setIsManager(
        Array.from(contest.managers).some((ob) => ob._id === user._id)
      );
    }
  }, [contest, user]);

  useEffect(() => {
    if (user) {
      for (let i = 0; i < participations.length; i++) {
        if (participations[i].user === user._id) {
          setIsRegistered(true);
          return;
        }
      }
    }
  }, [participations]);

  return contest ? (
    <div className="container">
      {user && user._id === contest.owner._id && (
        <EditManagers contest={contest} />
      )}
      {isManager && <CreateChallenge contest={contest} />}
      <div className="card mb-3" style={{ width: "100%" }}>
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={"/contest.avif"}
              className="img-fluid rounded-start"
              alt={contest.name}
              style={{ height: "100%" }}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{contest.name}</h5>
              <p className="card-text">{contest.description}</p>
              <p className="card-text">
                <small className="text-body-secondary">
                  {contest.challenges.length} Challenges
                </small>
              </p>
              <p className="card-text">
                {!isManager && !isRegistered && !contest.completed && (
                  <button
                    onClick={() => {
                      participate({ contestId: contest._id });
                    }}
                    className="btn btn-outline-primary"
                  >
                    Register
                  </button>
                )}
              </p>
              <p className="card-text">
                <Link href={`/dashboard/${contest.name}/admin`}>
                  Open Dashboard
                </Link>
              </p>
              <p className="card-text">
                {isManager && !contest.completed && (
                  <Link
                    href="/"
                    className="text-danger"
                    onClick={(e) => {
                      e.preventDefault();
                      markCompleted({ contestId: contest._id });
                    }}
                  >
                    Close Contest
                  </Link>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Challenge</th>
            <th scope="col">Difficulty</th>
            <th scope="col">Category</th>
            <th scope="col">{isManager ? "View" : "Solve"}</th>
          </tr>
        </thead>
        <tbody>
          {contest.challenges.map((ch, i) => (
            <tr>
              <th scope="row">{i + 1}</th>
              <td>{ch.title}</td>
              <td>{ch.difficulty}</td>
              <td>{ch.category}</td>
              <td>
                <Link
                  className={isRegistered || isManager ? "" : "disabledLink"}
                  href={`/challenge/${ch._id}`}
                >
                  {isManager ? "View" : "Solve"}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <Loader />
  );
};

export default ContestPage;
