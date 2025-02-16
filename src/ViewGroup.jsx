import { useURL } from './URLContext';

export default function ViewGroup({group}) {
    return (
	<p>
	    <b className="thingname"> { group.name } </b>
	    <table>
		{ group.subjects.map(
		    (s) => <tr key={s.id} >
			       <td>
			           {s.id}
			       </td>
			   </tr>) }
	    </table>
		{ JSON.stringify(group) }
	</p>
    )
}
