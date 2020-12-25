# What is CASL?

[CASL](https://casl.js.org/v4/en/) is a JavaScript library that you can manage the permissions of a user based on his role.

In this article, I will show you how to manage permissions with CASL in the Front-End using React and Redux.

# Why handle permissions in the Front-End?

One of our roles as Front-End developers is to reduce the number of requests sending to the server.

For example, we do Front-End validations of a form so we don't have to request the server with the data, and the server reply to us with the validation errors.

We will also manage permissions in the front-end. so the user doesn't have to request certain APIs that he/she doesn't have permissions of them. Eventually, we will reduce the load on the server and for the user.

> That doesn't mean we will eliminate equesting unauthorized permissions apis totally, We will need some of them in particular cases.

# 1. Getting Started.

> You can download the project repo from [HERE](https://github.com/YoussefZidan/casl-redux)

> You can find the final result [HERE](https://casl-redux-app.netlify.app/)

1. Create a react app.

```
npx create-react-app casl-app
```

3. install Redux, react-redux, and redux-thunk

```
npm install redux react-redux redux-thunk
```

3. install CASL

```
npm install @casl/react @casl/ability
```

# 2. Creating Can File.

Create a new file inside and name it **can.js**

can.js

```js
import { Ability, AbilityBuilder } from "@casl/ability";

const ability = new Ability();

export default (action, subject) => {
  return ability.can(action, subject);
};
```

Here we are importing `Ability` and `AbilityBuilder` from `@casl/ability`.

Then we are creating a new instance from the `Ability()`.

After that, we are exporting a default function that we will use later to check for the permission of the logged-in user.

# 3. Subscribing to the store.

can.js

```js
import { Ability, AbilityBuilder } from "@casl/ability";
import { store } from "../redux/storeConfig/store";

const ability = new Ability();

export default (action, subject) => {
  return ability.can(action, subject);
};

store.subscribe(() => {
  let auth = store.getState().auth;
});
```

Import your store and subscribe to it inside `can.js`.

Here I'm getting `auth` from the store.
And this is my redux folder and files:

store.js

```js
import { createStore, applyMiddleware, compose } from "redux";
import createDebounce from "redux-debounced";
import thunk from "redux-thunk";
import rootReducer from "../rootReducer";

const middlewares = [thunk, createDebounce()];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  {},
  composeEnhancers(applyMiddleware(...middlewares))
);

export { store };
```

rootReducer.js

```js
import { combineReducers } from "redux";
import authReducer from "./auth/authReducer";

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
```

authReducer.js

```js
const INITIAL_STATE = {};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, ...action.payload };
    case "LOGOUT":
      return {};
    default:
      return state;
  }
};

export default authReducer;
```

authActions.js

```js
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
```

In the login action, I'm hard coding the payload with an object of id, name, and permissions array.

> permissions array doesn't have to be like that more about that later.

# 4. Add defineRulesFor function in can.js

```js
import { Ability, AbilityBuilder } from "@casl/ability";
import { store } from "../redux/storeConfig/store";

const ability = new Ability();

export default (action, subject) => {
  return ability.can(action, subject);
};

store.subscribe(() => {
  let auth = store.getState().auth;
  ability.update(defineRulesFor(auth));
});

const defineRulesFor = (auth) => {
  const permissions = auth.permissions;
  const { can, rules } = new AbilityBuilder();

  // This logic depends on how the
  // server sends you the permissions array
  if (permissions) {
    permissions.forEach((p) => {
      let per = p.split("_");
      can(per[0], per[1]);
    });
  }

  return rules;
};
```

I Created `defineRulesFor` function that takes `auth` as an argument and we will get this `auth` from the store we are subscribing to it.
so, I added `ability.update(defineRulesFor(auth))` to the `store.subscribe()` body.

Then I'm getting `can` and `rules` from `new AbilityBuilder()`

And because my permissions array is a number of `strings` separated by `_`

```
permissions: ["add_users", "delete_users"]
```

I'm splitting those strings and passing the `action` and the `subject` to the `can` function.

This logic might change if the server is sending you just Ids to be something like that:

```js
const permissions = [2, 3, 5, 7];
if (permissions) {
  permissions.forEach((p) => {
    if (p === 3) can("add", "users");
    if (p === 7) can("delete", "users");
  });
}
```

Or maybe a pre-defined role.

```js
const role = "Editor";
if (role === "Editor") {
  can("add", "users");
  can("delete", "users");
}
```

And so on.

# 5. Checking Permissions.

app.jsx

```jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./redux/auth/authActions";
import CAN from "./casl/can";

export default () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  // rerender the component when `auth` changes
  useState(() => {}, [auth]);

  return (
    <React.Fragment>
      <h1>Welcome, {auth?.name || "Please Login!"}</h1>

      {CAN("add", "users") && (
        <button
          onClick={() => {
            alert("User Added!");
          }}
        >
          Add User
        </button>
      )}
      {CAN("delete", "users") && (
        <button
          onClick={() => {
            alert("User Deleted!");
          }}
        >
          Delete User
        </button>
      )}
      <div>
        <button
          onClick={() => {
            dispatch(login());
          }}
        >
          Login
        </button>
        <button
          onClick={() => {
            dispatch(logout());
          }}
        >
          Logout
        </button>
      </div>
    </React.Fragment>
  );
};
```

Here I'm displaying the buttons based on the permission of the logged-in user.

> You need to **rerender** the component when the `auth` changes using `useEffect`.

Check the final result [HERE](https://casl-redux-app.netlify.app/)

# Thank You.
