import { allKeysForVariables, valueForFeature } from './variables.js';


export default function FeaturesTable({subjects, meanVector, variables}) {
    let keys = allKeysForVariables(variables);
    return (
	<table>
		<thead>
		    <tr>
			<th>Subject ID</th>
			{ keys.map(
			    (k) => <th key={k}>{k}</th>) }
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
