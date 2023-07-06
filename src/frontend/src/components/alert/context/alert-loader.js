import React, { useState } from "react";
import AlertContext from "./alert-context";
import AlertMessage from "../alert-message";

const AlertLoader = (props) => {
  const [ message, setMessage ] = useState("");
  const [ successful, setSuccessful ] = useState(false);
  const [ isAlert, setIsAlert ] = useState(false);

  const alert = {
    showAlertMessage: (message, successful) => {
      setIsAlert(true);
      setMessage(message);
      setSuccessful(successful);
      setTimeout(() => {
        setIsAlert(false);
      }, 5000);
    }
  };

  return (
    <AlertContext.Provider value={alert}>
      { isAlert && <AlertMessage message={message} severity={successful ? "success" : "error"} setIsAlert={setIsAlert} /> }
      { props.children }
    </AlertContext.Provider>
  );
};

export default AlertLoader;
