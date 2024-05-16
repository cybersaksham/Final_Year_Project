import Link from "next/link";
import React from "react";

const Contest = ({ contest }) => {
  return (
    <div className="card" style={{ width: "18rem", marginBottom: "10px" }}>
      <img src={"/contest.avif"} className="card-img-top" alt={contest.name} />
      <div className="card-body">
        <h5 className="card-title">{contest.name}</h5>
        <p className="card-text">{contest.description}</p>
        <p className="card-text d-flex justify-content-between">
          <Link href={`/contest/${contest._id}`} className="text-primary">
            View
          </Link>
          {(contest.isRegistered || contest.isOwner || contest.isManager) &&
            !contest.completed && (
              <button
                className={`btn btn-sm ${
                  contest.isRegistered
                    ? "btn-success"
                    : contest.isManager
                    ? "btn-warning"
                    : contest.isOwner
                    ? "btn-primary"
                    : ""
                }`}
              >
                {contest.isRegistered
                  ? "Registered"
                  : contest.isManager
                  ? "Manager"
                  : contest.isOwner
                  ? "Owner"
                  : ""}
              </button>
            )}
        </p>
      </div>
    </div>
  );
};

export default Contest;
