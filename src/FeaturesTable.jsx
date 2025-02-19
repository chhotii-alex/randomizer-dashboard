import { useContext } from 'react';
import { allKeysForVariables, valueForFeature } from './variables.js';
import { useURL } from './URLContext';
import RefreshContext from './RefreshContext.js';
import ProtocolContext from './ProtocolContext.js';

export default function FeaturesTable({subjects, meanVector, variables}) {
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
	    }
	    else {
		refreshFunction();
	    }
	}
	catch {
	    // TODO
	}
    }

    let keys = allKeysForVariables(variables);
    return (
	<table>
		<thead>
		    <tr>
			<th>Subject ID</th>
			{ keys.map(
			    (k) => <th key={k}>{k}</th>) }
			<th/>
		    </tr>
		</thead>
		<tbody>
	   	  { subjects.map(
		      (s) => <tr key={s.id} >
			       <td>
			           {s.id}
			       </td>
				 {  keys.map(
				     (v) => <td key={v}>
						{valueForFeature(s.features,v)}
					     </td>)  
				 }
				 <td>{(s.groupName == null) &&
				      <button onClick={ e => groupSubject(s.id)} >Assign to Group</button>}</td>
			   </tr>) }
		</tbody>
		<tfoot>
		    { meanVector && (
		    <tr>
			<th> means: </th>
			{ keys.map(
			    (v) => <td key={v}>
				       <b>
					   {
					       valueForFeature(meanVector,v)
					   }
					   </b>
				   </td>)
			}
		    </tr>) }		    
		</tfoot>
	</table>
    )
}
