import ChallengeContext from "@/context/Challenges/ChallengeContext";
import ContestContext from "@/context/Contests/ConstesContext";
import React, { useContext, useState } from "react";

const CreateChallenge = ({ contest }) => {
  const [title, setTitle] = useState("");
  const [desc, setDescription] = useState("");
  const [points, setPoints] = useState(0);
  const [diff, setDiff] = useState("");
  const [category, setCategory] = useState("");
  const [flag, setFlag] = useState("");
  const [files, setFiles] = useState(null);

  const { createChallenge } = useContext(ChallengeContext);
  const { getById } = useContext(ContestContext);

  const handleSubmit = async () => {
    let formdata = new FormData();
    formdata.append("title", title);
    formdata.append("description", desc);
    formdata.append("points", points);
    formdata.append("difficulty", diff);
    formdata.append("category", category);
    formdata.append("flag", flag);
    formdata.append("files", files);
    formdata.append("contestId", contest._id);
    await createChallenge(formdata);
    getById(contest._id);
    clearForm();
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setPoints(0);
    setDiff("");
    setCategory("");
    setFlag("");
    setFiles(null);
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
        data-bs-target={`#addChallengeModal`}
      >
        <i class="bi bi-plus" />
      </button>
      <div
        className="modal fade"
        id={`addChallengeModal`}
        tabIndex={-1}
        aria-labelledby={`addChallengeModalLabel`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id={`addChallengeModalLabel`}>
                Add Challenge
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder=""
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="title">Title</label>
              </div>
              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="desc"
                  placeholder=""
                  value={desc}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <label htmlFor="desc">Description</label>
              </div>
              <div className="form-floating mb-2">
                <input
                  type="number"
                  className="form-control"
                  id="points"
                  placeholder=""
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                />
                <label htmlFor="points">Points</label>
              </div>
              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="diff"
                  placeholder=""
                  value={diff}
                  onChange={(e) => setDiff(e.target.value)}
                />
                <label htmlFor="diff">Difficulty</label>
              </div>
              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="cat"
                  placeholder=""
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <label htmlFor="cat">Category</label>
              </div>
              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="flag"
                  placeholder=""
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                />
                <label htmlFor="flag">Flag</label>
              </div>
              <input
                type="file"
                className="form-control"
                id="files"
                placeholder=""
                onChange={(e) => setFiles(e.target.files[0])}
              />
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleSubmit}
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

export default CreateChallenge;
