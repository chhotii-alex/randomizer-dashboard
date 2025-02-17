import { useURL } from './URLContext';
import { useState, useEffect, useContext } from 'react';
import ViewGroup from './ViewGroup';
import ViewVariables from './ViewVariables';
import FeaturesTable from './FeaturesTable';
import RefreshContext from './RefreshContext.js';

export default function ViewProtocol({name, protocol}) {
    const randomizerURL = useURL();
    const [groupList, setGroupList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [varNameList, setVarNameList] = useState([]);
    const [stopPanelShowing, setStopPanelShowing] = useState(false);
    const refreshFunction = useContext(RefreshContext);

    useEffect(() => {
	getGroups();
	getSubjects();
    }, [randomizerURL, name]);

    async function getGroups() {
	let url = `${randomizerURL}/${name}/groups`;
	try {
	    const response = await fetch(url);
	    if (!response.ok) {
		// TODO: deal with errors
	    }
	    else {
		const newGroupList = await response.json();
		console.log(newGroupList);
		setGroupList(newGroupList);
	    }
	}
	catch {
	    // TODO: deal with errors
	}
    }

    async function getSubjects() {
	let url = `${randomizerURL}/${name}/subjects`;
	try {
	    const response = await fetch(url);
	    if (!response.ok) {
		// TODO: deal with errors
	    }
	    else {
		const newSubjectList = await response.json();
		console.log("Subjects", newSubjectList);
		setSubjectList(newSubjectList);
	    }
	}
	catch {
	    // TODO: deal with errors
	}
    }

    function stopButtonClicked() {
	setStopPanelShowing(true);
    }

    async function reallyStop() {
	let url = `${randomizerURL}/${name}/stop`;
	try {
	    const response = await fetch(url, { method: "DELETE" } );
	    if (!response.ok) {
		console.log("Got response code:", response.status);
		//TODO
	    }
	    else {
		refreshFunction();
	    }
	}
	catch {
	    //TODO
	}
    }

    function cancelStop() {
	setStopPanelShowing(false);
    }

    return (
	<>
	    <h2> Protocol: {name}</h2> 
	    Using algorithm: <strong> {protocol.algorithm} </strong>
	    <ViewVariables variables={protocol.variables} />
	    <h3>Groups:</h3>
	    { groupList.map( (g) =>
		<ViewGroup group={g} variables={protocol.variables}
			   key={g.name} />
	    )}
	    <h3>Unassigned subjects:</h3>
	    <FeaturesTable subjects={ subjectList.filter(s => s.groupName == null)}
			   variables={protocol.variables}/>
	    <p> </p>
	    { stopPanelShowing ?
	      <div style={{backgroundColor: "red", padding: "2em"}}>
		  <h1> Really stop this protocol? Are you SURE??</h1>
		  <button onClick={reallyStop}>
		      Yes, please stop it now!
		  </button>
		  <button onClick={cancelStop}>
		      No
		  </button>
	      </div> :
   	      <button onClick={stopButtonClicked}>Stop Protocol</button> }
	    <hr/>
	</>
    )
}
