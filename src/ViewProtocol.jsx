import { useURL } from './URLContext';
import { useState, useEffect, useContext } from 'react';
import ViewVariables from './ViewVariables';
import FeaturesTable from './FeaturesTable';
import ViewAllGroups from './ViewAllGroups';
import ViewUnassignedSubjects from './ViewUnassignedSubjects';
import RefreshContext from './RefreshContext.js';
import ProtocolContext from './ProtocolContext.js';
import useFetch from './fetching.js';

export default function ViewProtocol({name, protocol, ticker}) {
    const randomizerURL = useURL();
    const [stopPanelShowing, setStopPanelShowing] = useState(false);
    const refreshFunction = useContext(RefreshContext);

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
	<ProtocolContext.Provider value={name}>
	    <h2> Protocol: {name}</h2> 
	    Using algorithm: <strong> {protocol.algorithm} </strong>
	    <ViewVariables variables={protocol.variables} />
	    <ViewAllGroups name={name} variables={protocol.variables} ticker={ticker} />
	    <ViewUnassignedSubjects name={name} variables={protocol.variables} ticker={ticker}/>
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
	</ProtocolContext.Provider>
    )
}
