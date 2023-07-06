import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, TextField, FormControl, InputLabel, Input, InputAdornment, IconButton, Button } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import AlertContext from "../alert/context/alert-context";
import { login } from "../../services/authentication-service";

const Login = (props) => {
  const [isShowedPasswrd, setIsShowedPassword] = useState(false);

  const alert = useContext(AlertContext);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Enter email").required("Email is required field"),
    password: Yup.string().required("Password is required field"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    login(data)
      .then(response => {
        localStorage.setItem("jwtToken", response.data.jwtToken);
        props.setIsUserAuthorized(true);
        navigate("/");
      })
      .catch(e => {
        alert?.showAlertMessage(e.response.data.message, false);
      });
  };

  const handleShowPassword = () => {
    setIsShowedPassword(!isShowedPasswrd);
  };

  return (
    <div className="login-page">
      <div className="registration-form">
        <Typography variant="h5" className="title">Login</Typography>
        <div>
          <TextField
            id="email"
            label="Email"
            type="email"
            size="small"
            variant="standard"
            {...register("email")}
            error={errors.email ? true : false}
            className="text-field"
          />
          <Typography variant="body2" color="error" fontSize={12}>
            {errors.email?.message?.toString()}
          </Typography>
        </div>
        <div>
          <FormControl
            variant="standard"
            error={errors.password ? true : false}
            className="text-field"
          >
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              type={isShowedPasswrd ? "text" : "password"}
              {...register("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleShowPassword}
                  >
                    {isShowedPasswrd ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Typography variant="body2" color="error" fontSize={12}>
            {errors.password?.message?.toString()}
          </Typography>
        </div>
        <Button id="login" variant="contained" onClick={handleSubmit(onSubmit)} className="button">Login</Button>
      </div>
    </div>
  );
};

export default Login;