import Contest from "@/components/Contest";
import Loader from "@/components/Loader";
import AuthContext from "@/context/Authentication/AuthContext";
import ContestContext from "@/context/Contests/ConstesContext";
import { useContext, useEffect } from "react";
import NewContest from "@/components/NewContest";
import { useRouter } from "next/router";

export default function Home() {
  const { user, fetchUser } = useContext(AuthContext);
  const { contests, getAllContests } = useContext(ContestContext);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    getAllContests();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="jumbotron text-center">
          <h1>Welcome to the CTF Challenge Platform!</h1>
          <p>Test your hacking skills and conquer challenging cyber puzzles.</p>
          {/* <div className="row my-5"> */}
          {/* <div className="col-sm-12 col-md-6"> */}
          <button
            className="btn btn-outline-primary"
            onClick={(e) => {
              e.preventDefault();
              router.push("/contests");
            }}
          >
            Start Hacking!
          </button>
          {/* </div> */}
          {/* <div className="col-sm-12 col-md-6">
              <button
                className="btn btn-outline-primary"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/contests");
                }}
              >
                See the Leaderboard
              </button>
            </div> */}
          {/* </div> */}
        </div>
        <div className="row mt-5">
          <div className="col">
            <h2>What is a CTF?</h2>
            <p>
              CTF stands for Capture the Flag. It's a gamified security
              competition where participants race to solve challenges that
              involve hacking, cryptography, forensics, and other cybersecurity
              skills. The goal is to be the first team to "capture the flag,"
              which is usually a secret piece of data hidden within a challenge.
            </p>
          </div>
          <div className="col">
            <h2>Why Participate?</h2>
            <p>
              CTFs are a great way to learn new cybersecurity skills, test your
              knowledge in a safe environment, and compete against other
              hackers. They can also be a lot of fun! Whether you're a seasoned
              security professional or just starting out, CTFs are a great way
              to challenge yourself and grow your skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return user && contests ? (
    <div className="container">
      <h3>Contests</h3>
      <NewContest />
      <div className="d-flex flex-wrap justify-content-between">
        {Array.from(contests).map((ch) => (
          <Contest key={ch._id} contest={ch} />
        ))}
      </div>
    </div>
  ) : (
    <Loader />
  );
}
