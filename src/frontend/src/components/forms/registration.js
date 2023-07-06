import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, TextField, FormControl, InputLabel, Button, Input, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import AlertContext from "../alert/context/alert-context";
import { registration } from "../../services/authentication-service";

const Registration = () => {
  const [isShowedPassword, setIsShowedPassword] = useState(false);
  const [isShowedRepetedPassword, setIsShowedRepetedPassword] = useState(false);

  const navigate = useNavigate();

  const alert = useContext(AlertContext);

  const passwordInputList = [{ name: "password", label: "Password" }, { name: "repetedPassword", label: "Repeted password" }];

  const handleShowPassword = () => {
    setIsShowedPassword(!isShowedPassword);
  };

  const handleShowRepetedPassword = () => {
    setIsShowedRepetedPassword(!isShowedRepetedPassword);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is required field"),
    repetedPassword: Yup.string().required("Repeted is required field"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    if (data.password !== data.repetedPassword) {
      alert?.showAlertMessage("Password and repeted password are different.", false);
      return;
    }
    const registrationData = {
      email: data.email,
      password: data.password
    }
    registration(registrationData)
      .then(() => {
        alert?.showAlertMessage("Registration was successful.", true);
        navigate("/login");
      })
      .catch(e => {
        alert?.showAlertMessage(e.response.data.message, false);
      });
  };

  return (
    <div className="registration-page">
      <div className="registration-form">
        <Typography variant="h5" className="title">Registration</Typography>
        <div>
          <TextField
            id="email"
            label="Email"
            type="email"
            size="small"
            variant="standard"
            required
            className="text-field"
            {...register("email")}
            error={errors.email ? true : false}
          />
          <Typography variant="body2" color="error" fontSize={12}>
            {errors.email?.message?.toString()}
          </Typography>
        </div>
        {passwordInputList.map((item) =>
          <div key={item.name}>
            <FormControl
              variant="standard"
              className="text-field"
              required
              {...register(item.name)}
              error={errors[item.name] ? true : false} >
              <InputLabel htmlFor={item.name}>{item.label}</InputLabel>
              <Input
                name={item.name}
                type={(item.name === "password" ? isShowedPassword : isShowedRepetedPassword) ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={item.name === "password" ? handleShowPassword : handleShowRepetedPassword}
                    >
                      {(item.name === "password" ? isShowedPassword : isShowedRepetedPassword) ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Typography variant="body2" color="error" fontSize={12}>
              {errors[item.name]?.message?.toString()}
            </Typography>
          </div>)}
        <Button id="send" variant="contained" onClick={handleSubmit(onSubmit)} className="button">Register</Button>
      </div>
    </div >
  ); 
};

export default Registration;