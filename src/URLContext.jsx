import { createContext, useContext, useReducer } from "react";

const URLContext = createContext(null);
const URLDispatchContext = createContext(null);

export function URLProvider({ children }) {
  const [url, dispatch] = useReducer(urlReducer, "");

  return (
    <URLContext.Provider value={url}>
      <URLDispatchContext.Provider value={dispatch}>
        {children}
      </URLDispatchContext.Provider>
    </URLContext.Provider>
  );
}

export function useURL() {
  return useContext(URLContext);
}

export function useURLDispatch() {
  return useContext(URLDispatchContext);
}

function urlReducer(url, action) {
  switch (action.type) {
    case "update": {
      return action.text;
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
