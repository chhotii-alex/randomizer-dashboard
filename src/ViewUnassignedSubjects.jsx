import { useContext } from 'react';
import useFetch from './fetching.js';
import { useURL } from './URLContext';
import FeaturesTable from './FeaturesTable';
import RefreshContext from './RefreshContext.js';
import ProtocolContext from './ProtocolContext.js';

export default function ViewUnassignedSubjects({name, variables, ticker}) {
    const randomizerURL = useURL();
    const protocol = useContext(ProtocolContext);
    const refreshFunction = useContext(RefreshContext);
    const { data, loading, error } = useFetch(`${randomizerURL}/${name}/subjects`, ticker);

    async function assignAll() {
	let url = `${randomizerURL}/${protocol}/assignall`;
	try {
	    const response = await fetch(url, {
		method: "POST",
		body: '',
		headers: {
		    "Content-Type": "application/json",
		},
	    });
	    if (!response.ok) {
		console.log("GOt response code:", response.status);
		//TODO
	    }
	    else {
		refreshFunction();
	    }
	}
	catch {
	    // TODO
	}
    }
    
    return (
	<>
	    <p className="error">{error?.message}</p>   
	    { loading ? <span>Loading...</span> :
	      <div>
		  <h3>Unassigned subjects:</h3>
		  <FeaturesTable subjects={ data.filter(s => s.groupName == null)}
				 variables={variables}/>
		  { !!(data.filter(s => s.groupName == null).length) &&
		    <button onClick={assignAll}>Assign All to Groups</button> }
	      </div>
	    }
	</>
    )    
}
