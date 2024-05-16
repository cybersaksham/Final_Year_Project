import React, { useState } from "react";
import { useRouter } from "next/router";
import useRequest from "../../Hooks/Request";
import ChallengeContext from "./ChallengeContext";

const ChallengeState = (props) => {
  const HOST = process.env.NEXT_PUBLIC_BACKEND_URI + "/challenge";

  const checkRequest = useRequest();
  const router = useRouter();

  const [challenges, setChallenges] = useState([]);
  const [challenge, setChallenge] = useState(null);

  // Create
  const createChallenge = async (formdata) => {
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
        checkRequest(response.status, json.error, "Challenge created", null);
      } else {
        checkRequest(404, "Session timeout", null, () => {
          router.push("/auth/login");
        });
      }
    } catch (e) {
      checkRequest(404, "Try Again", null, () => {});
    }
  };

  // Submit Flag
  const submitFlag = async ({ challengeId, flag }) => {
    try {
      let token = await JSON.parse(localStorage.getItem("token"));
      if (token) {
        const response = await fetch(HOST + "/submit", {
          method: "POST",
          headers: {
            "auth-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ challengeId, flag }),
        });
        const json = await response.json();
        checkRequest(response.status, json.error, json.msg, null);
      } else {
        checkRequest(404, "Session timeout", null, () => {
          router.push("/auth/login");
        });
      }
    } catch (e) {
      checkRequest(404, "Try Again", null, null);
    }
  };

  // Get All Challenges
  const getAllChallenges = async () => {
    try {
      let token = await JSON.parse(localStorage.getItem("token"));
      if (token) {
        const response = await fetch(HOST, {
          method: "GET",
        });
        const json = await response.json();
        checkRequest(response.status, json.error, null, () => {
          setChallenges([...json]);
        });
      } else {
        checkRequest(404, "Session timeout", null, null);
        router.push("/auth/login");
      }
    } catch (e) {
      checkRequest(404, "Try Again", null, null);
    }
  };

  // Get Challenge By Id
  const getById = async (id) => {
    try {
      let token = await JSON.parse(localStorage.getItem("token"));
      if (token) {
        const response = await fetch(HOST + "/" + id, {
          method: "GET",
        });
        const json = await response.json();
        checkRequest(response.status, json.error, null, () => {
          setChallenge(json);
        });
      } else {
        checkRequest(404, "Session timeout", null, null);
        router.push("/auth/login");
      }
    } catch (e) {
      checkRequest(404, "Try Again", null, null);
    }
  };

  return (
    <ChallengeContext.Provider
      value={{
        challenges,
        challenge,
        createChallenge,
        submitFlag,
        getAllChallenges,
        getById,
      }}
    >
      {props.children}
    </ChallengeContext.Provider>
  );
};

export default ChallengeState;
