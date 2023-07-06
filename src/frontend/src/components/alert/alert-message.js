import React from "react";
import { Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AlertMessage = (props) => {

  return (
    <Alert
      severity={props.severity}
      variant="filled"
      className="alert"
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => {
            props.setIsAlert(false);
          }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
    >
      { props.message }
    </Alert>
  );
};

export default AlertMessage;