export const login = (user) => async (dispatch) => {
  dispatch({
    type: "LOGIN",
    payload: {
      id: 1,
      name: "Youssef",
      permissions: ["add_users", "delete_users"],
    },
  });
};

export const logout = () => async (dispatch) => {
  dispatch({
    type: "LOGOUT",
  });
};
