import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CAN from "./config/casl/can";
import { login, logout } from "./redux/auth/authActions";

export default function App({ props }) {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  useState(() => {}, [auth]);

  return (
    <React.Fragment>
      <h1>Welcome, {auth?.name || "Please Login!"}</h1>
      {CAN("add", "users") && (
        <button
          onClick={() => {
            alert("User Added!");
          }}>
          Add User
        </button>
      )}
      {CAN("delete", "users") && (
        <button
          onClick={() => {
            alert("User Deleted!");
          }}>
          Delete User
        </button>
      )}
      <div>
        <button
          onClick={() => {
            dispatch(login());
          }}>
          Login
        </button>
        <button
          onClick={() => {
            dispatch(logout());
          }}>
          Logout
        </button>
      </div>
    </React.Fragment>
  );
}
