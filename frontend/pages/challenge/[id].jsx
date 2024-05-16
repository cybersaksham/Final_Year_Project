import Loader from "@/components/Loader";
import ChallengeContext from "@/context/Challenges/ChallengeContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const ChallengePage = () => {
  const router = useRouter();
  const [id, setId] = useState(null);
  const { challenge, getById, submitFlag } = useContext(ChallengeContext);

  useEffect(() => {
    if (router.query) setId(router.query.id);
  }, [router.query]);

  useEffect(() => {
    if (id) getById(id);
  }, [id]);

  const [flag, setFlag] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    submitFlag({ challengeId: challenge._id, flag });
  };

  return challenge ? (
    <div className="container">
      <div className="d-flex flex-column">
        <h4>{challenge.title}</h4>
        <p>{challenge.description}</p>
        <div>
          <span>
            <strong>Difficulty: </strong>
          </span>
          <span>{challenge.difficulty}</span>
        </div>
        <div>
          <span>
            <strong>Category: </strong>
          </span>
          <span>{challenge.category}</span>
        </div>
        <div>
          <span>
            <strong>Points: </strong>
          </span>
          <span>{challenge.points}</span>
        </div>
        {challenge.files && (
          <div>
            <a href={challenge.files} download={true}>
              Download Zip
            </a>
            <span> or paste this link in browser </span>
            <span className="text-primary">{challenge.files}</span>
          </div>
        )}
      </div>

      <form className="d-flex mt-5 align-items-center" style={{ width: "50%" }}>
        <input
          id="flagInput"
          className="form-control"
          style={{ marginRight: "5px" }}
          placeholder="Enter flag"
          value={flag}
          onChange={(e) => {
            setFlag(e.target.value);
          }}
        />
        <button className="btn btn-outline-primary" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  ) : (
    <Loader />
  );
};

export default ChallengePage;
