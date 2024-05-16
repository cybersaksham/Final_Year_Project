import ChallengeContext from "@/context/Challenges/ChallengeContext";
import React, { useContext, useState } from "react";

const Challenge = ({ challenge }) => {
  const { submitFlag } = useContext(ChallengeContext);
  const [flag, setFlag] = useState("");

  return (
    <div className="card" style={{ width: "18rem", margin: "5px" }}>
      <div className="card-body">
        <h5 className="card-title">{challenge.title}</h5>
        <h6 className="card-subtitle mb-2 text-body-secondary">
          {challenge.category}
        </h6>
        <p className="card-text">{challenge.description}</p>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target={`#submitFlagModal_${challenge._id}`}
        >
          Submit
        </button>

        <div
          className="modal fade"
          id={`submitFlagModal_${challenge._id}`}
          tabIndex={-1}
          aria-labelledby={`submitFlagModal_${challenge._id}Label`}
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1
                  className="modal-title fs-5"
                  id={`submitFlagModal_${challenge._id}Label`}
                >
                  {challenge.title}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <input
                  className="form-control"
                  placeholder="Enter flag"
                  value={flag}
                  onChange={(e) => {
                    setFlag(e.target.value);
                  }}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  data-bs-dismiss="modal"
                  onClick={(e) => {
                    e.preventDefault();
                    submitFlag({ challengeId: challenge._id, flag });
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* <a href="#" className="card-link">
          Card link
        </a> */}
      </div>
    </div>
  );
};

export default Challenge;
