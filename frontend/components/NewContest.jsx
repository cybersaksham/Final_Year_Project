import ContestContext from "@/context/Contests/ConstesContext";
import React, { useContext, useState } from "react";

const NewContest = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const { hostContest } = useContext(ContestContext);

  const handleSubmit = () => {
    const formdata = new FormData();
    formdata.append("img", file);
    formdata.append("name", name);
    formdata.append("description", desc);
    hostContest(formdata);
  };

  return (
    <>
      <button
        style={{
          outline: "none",
          position: "fixed",
          zIndex: 100,
          bottom: 0,
          right: 0,
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
        data-bs-target={`#hostContestModal`}
      >
        <i class="bi bi-plus"></i>
      </button>
      <div
        className="modal fade"
        id={`hostContestModal`}
        tabIndex={-1}
        aria-labelledby={`hostContestModalLabel`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id={`hostContestModalLabel`}>
                Host Contest
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder=""
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="name">Contest Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  placeholder=""
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label htmlFor="description">Description</label>
              </div>
              <input
                type="file"
                className="form-control"
                id="image"
                placeholder=""
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-primary"
                data-bs-dismiss="modal"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewContest;
