import { useURL } from './URLContext';
import { allKeysForVariables, valueForFeature } from './variables.js';

export default function ViewGroup({group, variables}) {
    let keys = allKeysForVariables(variables);
    return (
	<div>
	    <b className="thingname"> { group.name } </b>
	    <table>
		<thead>
		    <tr>
			<th>Subject ID</th>
			{ keys.map(
			    (k) => <th key={k}>{k}</th>) }
		    </tr>
		</thead>
		<tbody>
	   	  { group.subjects.map(
		      (s) => <tr key={s.id} >
			       <td>
			           {s.id}
			       </td>
				 {  keys.map(
				     (v) => <td key={v}>
						{valueForFeature(s.features,v)}
					     </td>)  
				 }
			   </tr>) }
		</tbody>
		<tfoot>
		    { group.meanVector && (
		    <tr>
			<th> means: </th>
			{ keys.map(
			    (v) => <td key={v}>
				       <b>
					   {valueForFeature(group.meanVector,v)}
					   </b>
				   </td>)
			}
		    </tr>) }
		    
		</tfoot>
	    </table>
	</div>
    )
}
