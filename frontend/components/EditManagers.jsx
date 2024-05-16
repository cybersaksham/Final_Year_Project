import ContestContext from "@/context/Contests/ConstesContext";
import React, { useContext, useState } from "react";

const EditManagers = ({ contest }) => {
  const [email, setEmail] = useState("");
  const { addManager, removeManager } = useContext(ContestContext);

  return (
    <>
      <button
        style={{
          outline: "none",
          position: "fixed",
          zIndex: 100,
          bottom: 0,
          right: 60,
          margin: "20px",
          borderRadius: "50px",
          backgroundColor: "#0C6DFD",
          color: "white",
          width: "50px",
          height: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "23px",
        }}
        data-bs-toggle="modal"
        data-bs-target={`#editManagerModal`}
      >
        <i class="bi bi-person-plus-fill"></i>
      </button>
      <div
        className="modal fade"
        id={`editManagerModal`}
        tabIndex={-1}
        aria-labelledby={`editManagerModalLabel`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id={`editManagerModalLabel`}>
                Managers
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              {/* Managers List */}
              <ul className="list-group mb-3">
                {contest.managers.map((mn) => (
                  <li key={mn._id} className="list-group-item">
                    <div className="d-flex justify-content-between">
                      <span>
                        {mn.email} {mn.username}
                      </span>
                      <span
                        className="text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          removeManager({
                            contestId: contest._id,
                            manager: mn.email,
                          })
                        }
                      >
                        <i class="bi bi-trash-fill"></i>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <div className="form-floating" style={{ width: "80%" }}>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email">Manager Email</label>
              </div>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={async () => {
                  await addManager({
                    contestId: contest._id,
                    manager: email,
                  });
                  setEmail("");
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditManagers;
