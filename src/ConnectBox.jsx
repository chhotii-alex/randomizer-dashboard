import { useState } from "react";
import { useURL, useURLDispatch } from "./URLContext";

async function getRandomizerOK(baseURL) {
  try {
    const response = await fetch(baseURL);
    if (!response.ok) {
      return false;
    }
    const text = await response.text();
    return text == "This is the group randomization server.";
  } catch {
    return false;
  }
}

export default function ConnectBox() {
  const [errorMessage, setErrorMessage] = useState("");
  const url = useURL();
  const [tempURL, setTempURL] = useState("http://localhost:8080");
  const dispatch = useURLDispatch();

  function handleTextChange(e) {
    setTempURL(e.target.value);
  }

  async function connect() {
    const isPR = await getRandomizerOK(tempURL);
    if (isPR) {
      setErrorMessage("");
      dispatch({ type: "update", text: tempURL });
    } else {
      setErrorMessage("Failed to connect; is the URL correct?");
    }
  }

  return (
    <div>
      <p>
        <label>
          Specify URL (including port) of the prospective-randomizer server:
        </label>
        <input value={tempURL} onChange={handleTextChange} />
      </p>
      <button onClick={connect}>Connect</button>
      <p className="error">{errorMessage}</p>
    </div>
  );
}
