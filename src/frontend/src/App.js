import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AlertLoader from "./components/alert/context/alert-loader";
import Menu from "./components/menu/menu";
import Registration from "./components/forms/registration";
import Login from "./components/forms/login";
import PostList from "./components/post-list/post-list";
import './App.css';

export default function App() {
  const [isUserAuthorized, setIsUserAuthorized] = useState(localStorage.getItem("jwtToken"))

  return (
    <AlertLoader>
      <BrowserRouter>
        <Menu isUserAuthorized={isUserAuthorized} setIsUserAuthorized={setIsUserAuthorized} />
        <div className="app">
          <Routes>
            <Route path="/" element={<PostList isUserAuthorized={isUserAuthorized} />} />
            <Route path="*" element={<div>No page</div>} />
            {!isUserAuthorized && <>
                <Route path="/registration" element={<Registration />} />
                <Route path="/login" element={<Login setIsUserAuthorized={setIsUserAuthorized} />} />
                <Route path="*" element={<div>No page</div>} />
              </>}
          </Routes>
        </div>
      </BrowserRouter>
    </AlertLoader>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
