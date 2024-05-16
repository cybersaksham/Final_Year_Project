import { useContext } from "react";
import AlertContext from "../context/Alert/AlertContext";

const useRequest = () => {
  const { showAlert } = useContext(AlertContext);

  const checkRequest = (status, error, success, callback) => {
    if (callback) callback();
    if (status === 200) {
      if (success) showAlert("success", success);
    } else {
      if (error) showAlert("danger", error);
    }
  };

  return checkRequest;
};

export default useRequest;
