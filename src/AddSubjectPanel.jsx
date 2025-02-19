import { useState, useContext, useReducer } from 'react';
import { useURL } from './URLContext';
import RefreshContext from './RefreshContext.js';
import ProtocolContext from './ProtocolContext.js';

function defaultFeatureSet(variables) {
    let features = {};
    for (const v of variables) {
	if (v.type == 'continuous') {
	    features[v.name] = 0;
	}
	else {
	    features[v.name] = v.levels[0];
	}
    }
    return features;
}

function reducer(features, action) {
    if (action.type === 'updateFeature') {
	let newFeatures = {...features};
	newFeatures[action.key] = action.value;
	return newFeatures;
    }
}

export default function AddSubjectPanel({ protocol, cancel }) {
    const randomizerURL = useURL();
    const protocolName = useContext(ProtocolContext);
    const refreshFunction = useContext(RefreshContext);
    const [subjectID, setSubjectID] = useState('');
    const initialFeatures = defaultFeatureSet(protocol.variables);
    const [features, dispatch] = useReducer(reducer, initialFeatures);
    const errorMessage = validate();

    function validate() {
	if (!subjectID || subjectID.length < 1) {
	    return "Subject ID must not be empty";
	}
	for (const v of protocol.variables) {
	    if (v.type == 'continuous') {
		if (isNaN(parseFloat(features[v.name]))) {
		    return `Please enter a numeric value for ${v.name}`;
		}
	    }
	}
	return null;
    }

    async function submitSubject() {
	let url = `${randomizerURL}/${protocolName}/subject/${subjectID}`;
	try {
	    const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify(features),
		headers: {
		    "Content-Type": "application/json",
		},
	    });
	    if (!response.ok) {
		console.log("got response code:", response.status);
	    }
	    else {
		refreshFunction();
		cancel();
	    }
	}
	catch (error) {
	    console.log(error);
	}
    }

    return <fieldset>
	       <legend>Add Subject Panel</legend>
	       <p>
		   Subject ID:
		   <input value={subjectID} onChange={e => setSubjectID(e.target.value.replace(/\s/g, ''))} />
	       </p>
	       { protocol.variables.map( (v, i) =>  <p key={v.name} >
							{ v.name }:
							{ (v.type=="continuous") ? <input type="number"
											  value={features[v.name]}
											  onChange={e => dispatch({type:'updateFeature', key:v.name, value:e.target.value})}/> :
							  <select value={ features[v.name] }
								  onChange={e => dispatch({type:'updateFeature', key:v.name, value:e.target.value}) } >
							      { v.levels.map( (level) => <option key={level} value={level}>
											     {level}
											 </option>) }
							  </select>}
						    </p>  )
	       }
	       { errorMessage ? <p className="error">{errorMessage}</p> : <button onClick={submitSubject}>Submit</button> }
	       <button onClick={cancel}>Cancel</button>
	   </fieldset>;
}
