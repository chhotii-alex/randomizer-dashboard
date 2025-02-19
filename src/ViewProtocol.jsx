import { allKeysForVariables, valueForFeature } from "./variables.js";
import { useURL } from "./URLContext";
import { useState, useEffect, useContext } from "react";
import RefreshContext from "./RefreshContext.js";
import ProtocolContext from "./ProtocolContext.js";
import useFetch from "./fetching.js";
import AddSubjectPanel from "./AddSubjectPanel";

function ViewVariables({ variables }) {
  return (
    <>
      <h4>Variables:</h4>
      {variables.map((v) => (
        <p key={v.name}>
          <b className="thingname">{v.name}</b>
          <span>{v.type}</span>
          {v.levels &&
            v.levels.map((option, index) => (
              <em key={option}>
                {index > 0 && ","} {option}
              </em>
            ))}
        </p>
      ))}
    </>
  );
}

function FeaturesTable({ subjects, meanVector, variables }) {
  const randomizerURL = useURL();
  const protocol = useContext(ProtocolContext);
  const refreshFunction = useContext(RefreshContext);

  async function groupSubject(subjectID) {
    let url = `${randomizerURL}/${protocol}/subject/${subjectID}/group`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.log("GOt response code:", response.status);
        //TODO
      } else {
        refreshFunction();
      }
    } catch {
      // TODO
    }
  }

  let keys = allKeysForVariables(variables);
  return (
    <table>
      <thead>
        <tr>
          <th>Subject ID</th>
          {keys.map((k) => (
            <th key={k}>{k}</th>
          ))}
          <th />
        </tr>
      </thead>
      <tbody>
        {subjects.map((s) => (
          <tr key={s.id}>
            <td>{s.id}</td>
            {keys.map((v) => (
              <td key={v}>{valueForFeature(s.features, v)}</td>
            ))}
            <td>
              {s.groupName == null && (
                <button onClick={(e) => groupSubject(s.id)}>
                  Assign to Group
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        {meanVector && (
          <tr>
            <th> means: </th>
            {keys.map((v) => (
              <td key={v}>
                <b>{valueForFeature(meanVector, v)}</b>
              </td>
            ))}
          </tr>
        )}
      </tfoot>
    </table>
  );
}

function ViewGroup({ group, variables }) {
  return (
    <div>
      <b className="thingname"> {group.name} </b>
      <FeaturesTable
        subjects={group.subjects}
        variables={variables}
        meanVector={group.meanVector}
      />
    </div>
  );
}

function ViewAllGroups({ name, variables, ticker }) {
  const randomizerURL = useURL();
  const { data, loading, error } = useFetch(
    `${randomizerURL}/${name}/groups`,
    ticker,
  );
  return (
    <>
      <p className="error">{error?.message}</p>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <div>
          <h3>Groups:</h3>
          {data.map((g) => (
            <ViewGroup group={g} variables={variables} key={g.name} />
          ))}
        </div>
      )}
    </>
  );
}

function ViewUnassignedSubjects({ name, variables, ticker }) {
  const randomizerURL = useURL();
  const protocol = useContext(ProtocolContext);
  const refreshFunction = useContext(RefreshContext);
  const { data, loading, error } = useFetch(
    `${randomizerURL}/${name}/subjects`,
    ticker,
  );

  async function assignAll() {
    let url = `${randomizerURL}/${protocol}/assignall`;
    try {
      const response = await fetch(url, {
        method: "POST",
        body: "",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.log("GOt response code:", response.status);
        //TODO
      } else {
        refreshFunction();
      }
    } catch {
      // TODO
    }
  }

  return (
    <>
      <p className="error">{error?.message}</p>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <div>
          <h3>Unassigned subjects:</h3>
          <FeaturesTable
            subjects={data.filter((s) => s.groupName == null)}
            variables={variables}
          />
          {!!data.filter((s) => s.groupName == null).length && (
            <button onClick={assignAll}>Assign All to Groups</button>
          )}
        </div>
      )}
    </>
  );
}

export default function ViewProtocol({ name, protocol, ticker }) {
  const randomizerURL = useURL();
  const [stopPanelShowing, setStopPanelShowing] = useState(false);
  const [addSubjectPanelShowing, setAddSubjectPanelShowing] = useState(false);
  const refreshFunction = useContext(RefreshContext);

  function stopButtonClicked() {
    setStopPanelShowing(true);
  }

  function addSubjectClicked() {
    setAddSubjectPanelShowing(true);
  }

  function cancelAddSubject() {
    setAddSubjectPanelShowing(false);
  }

  async function reallyStop() {
    let url = `${randomizerURL}/${name}/stop`;
    try {
      const response = await fetch(url, { method: "DELETE" });
      if (!response.ok) {
        console.log("Got response code:", response.status);
        //TODO
      } else {
        refreshFunction();
      }
    } catch {
      //TODO
    }
  }

  function cancelStop() {
    setStopPanelShowing(false);
  }

  return (
    <ProtocolContext.Provider value={name}>
      <h2> Protocol: {name}</h2>
      Using algorithm: <strong> {protocol.algorithm} </strong>
      <ViewVariables variables={protocol.variables} />
      <ViewAllGroups
        name={name}
        variables={protocol.variables}
        ticker={ticker}
      />
      <ViewUnassignedSubjects
        name={name}
        variables={protocol.variables}
        ticker={ticker}
      />
      <p> </p>
      {addSubjectPanelShowing ? (
        <AddSubjectPanel protocol={protocol} cancel={cancelAddSubject} />
      ) : (
        <button onClick={addSubjectClicked}> Add Subject </button>
      )}
      {stopPanelShowing ? (
        <div style={{ backgroundColor: "red", padding: "2em" }}>
          <h1> Really stop this protocol? Are you SURE??</h1>
          <button onClick={reallyStop}>Yes, please stop it now!</button>
          <button onClick={cancelStop}>No</button>
        </div>
      ) : (
        <button onClick={stopButtonClicked}>Stop Protocol</button>
      )}
      <hr />
    </ProtocolContext.Provider>
  );
}
