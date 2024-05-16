import React, { useState } from "react";
import { useRouter } from "next/router";
import useRequest from "../../Hooks/Request";
import ContestContext from "./ConstesContext";

const ContestState = (props) => {
  const HOST = process.env.NEXT_PUBLIC_BACKEND_URI + "/contest";

  const checkRequest = useRequest();
  const router = useRouter();

  const [contests, setContests] = useState([]);
  const [contest, setContest] = useState(null);
  const [participations, setParticipations] = useState([]);

  // Host
  const hostContest = async (formdata) => {
    try {
      let token = await JSON.parse(localStorage.getItem("token"));
      if (token) {
        const response = await fetch(HOST, {
          method: "POST",
          headers: {
            "auth-token": token,
          },
          body: formdata,
        });
        const json = await response.json();
        checkRequest(response.status, json.error, "Contest created", () => {
          setContests([...contests, json]);
          getAllContests();
        });
      } else {
        checkRequest(404, "Session timeout", null, () => {
          router.push("/auth/login");
        });
      }
    } catch (e) {
      checkRequest(404, "Try Again", null, () => {});
    }
  };

  // Add Manager
  const addManager = async ({ contestId, manager }) => {
    try {
      let token = await JSON.parse(localStorage.getItem("token"));
      if (token) {
        const response = await fetch(HOST + "/addManager", {
          method: "POST",
          headers: {
            "auth-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contestId, manager }),
        });
        const json = await response.json();
        checkRequest(response.status, json.error, json.msg, () =>
          getById(contestId)
        );
      } else {
        checkRequest(404, "Session timeout", null, () => {
          router.push("/auth/login");
        });
      }
    } catch (e) {
      checkRequest(404, "Try Again", null, () => {});
    }
  };

  // Remove Manager
  const removeManager = async ({ contestId, manager }) => {
    try {
      let token = await JSON.parse(localStorage.getItem("token"));
      if (token) {
        const response = await fetch(HOST + "/removeManager", {
          method: "POST",
          headers: {
            "auth-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contestId, manager }),
        });
        const json = await response.json();
        checkRequest(response.status, json.error, json.msg, () =>
          getById(contestId)
        );
      } else {
        checkRequest(404, "Session timeout", null, () => {
          router.push("/auth/login");
        });
      }
    } catch (e) {
      checkRequest(404, "Try Again", null, () => {});
    }
  };

  // Get All Contests
  const getAllContests = async () => {
    try {
      let token = await JSON.parse(localStorage.getItem("token"));
      if (token) {
        const response = await fetch(HOST, {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        });
        const json = await response.json();
        checkRequest(response.status, json.error, null, () => {
          setContests([...json]);
        });
      } else {
        checkRequest(404, "Session timeout", null, null);
        router.push("/auth/login");
      }
    } catch (e) {
      checkRequest(404, "Try Again", null, null);
    }
  };

  // Get All Contests By Owner
  const getAllContestsByOwner = async () => {
    try {
      let token = await JSON.parse(localStorage.getItem("token"));
      if (token) {
        const response = await fetch(HOST + "/getByOwner", {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        });
        const json = await response.json();
        checkRequest(response.status, json.error, null, () => {
          setContests([...json]);
        });
      } else {
        checkRequest(404, "Session timeout", null, null);
        router.push("/auth/login");
      }
    } catch (e) {
      checkRequest(404, "Try Again", null, null);
    }
  };

  // Get Contest By Id
  const getById = async (id) => {
    try {
      let token = await JSON.parse(localStorage.getItem("token"));
      if (token) {
        const response = await fetch(HOST + "/" + id, {
          method: "GET",
        });
        const json = await response.json();
        checkRequest(response.status, json.error, null, () => {
          setContest(json);
        });
      } else {
        checkRequest(404, "Session timeout", null, null);
        router.push("/auth/login");
      }
    } catch (e) {
      checkRequest(404, "Try Again", null, null);
    }
  };

  // Get Participations
  const getParticipations = async (contestId) => {
    try {
      let token = await JSON.parse(localStorage.getItem("token"));
      if (token) {
        const response = await fetch(HOST + "/participations/" + contestId, {
          method: "GET",
        });
        const json = await response.json();
        checkRequest(response.status, json.error, null, () => {
          setParticipations([...json]);
        });
      } else {
        checkRequest(404, "Session timeout", null, null);
        router.push("/auth/login");
      }
    } catch (e) {
      checkRequest(404, "Try Again", null, null);
    }
  };

  // Participate in contest
  const participate = async ({ contestId }) => {
    try {
      let token = await JSON.parse(localStorage.getItem("token"));
      if (token) {
        const response = await fetch(HOST + "/participate", {
          method: "POST",
          headers: {
            "auth-token": token,
            "content-type": "application/json",
          },
          body: JSON.stringify({ contestId }),
        });
        const json = await response.json();
        checkRequest(
          response.status,
          json.error,
          "Participated successfully",
          () => {
            getParticipations(contestId);
          }
        );
      } else {
        checkRequest(404, "Session timeout", null, () => {
          router.push("/auth/login");
        });
      }
    } catch (e) {
      checkRequest(404, "Try Again", null, () => {});
    }
  };

  // Participate in contest
  const markCompleted = async ({ contestId }) => {
    try {
      let token = await JSON.parse(localStorage.getItem("token"));
      if (token) {
        const response = await fetch(HOST + "/complete", {
          method: "POST",
          headers: {
            "auth-token": token,
            "content-type": "application/json",
          },
          body: JSON.stringify({ contestId }),
        });
        const json = await response.json();
        checkRequest(
          response.status,
          json.error,
          "Contest closed successfully",
          () => {}
        );
      } else {
        checkRequest(404, "Session timeout", null, () => {
          router.push("/auth/login");
        });
      }
    } catch (e) {
      checkRequest(404, "Try Again", null, () => {});
    }
  };

  return (
    <ContestContext.Provider
      value={{
        contests,
        contest,
        participations,
        hostContest,
        addManager,
        removeManager,
        getAllContests,
        getAllContestsByOwner,
        getById,
        getParticipations,
        participate,
        markCompleted,
      }}
    >
      {props.children}
    </ContestContext.Provider>
  );
};

export default ContestState;
