import "@/styles/globals.css";
import AlertState from "@/context/Alert/AlertState";
import AuthState from "@/context/Authentication/AuthState";
import Alert from "@/components/Alert";
import ChallengeState from "@/context/Challenges/ChallengeState";
import Navbar from "@/components/Navbar";
import ContestState from "@/context/Contests/ContestState";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  return (
    <AlertState>
      <AuthState>
        <ContestState>
          <ChallengeState>
            <Main>
              <Component {...pageProps} />
            </Main>
          </ChallengeState>
        </ContestState>
      </AuthState>
    </AlertState>
  );
}

function Main({ children }) {
  const router = useRouter();
  return (
    <div>
      <Navbar />
      {!router.route.startsWith("/dashboard") && <Alert />}
      {children}
    </div>
  );
}
