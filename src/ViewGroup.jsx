import { useURL } from './URLContext';
import FeaturesTable from './FeaturesTable';

export default function ViewGroup({group, variables}) {
    return (
	<div>
	    <b className="thingname"> { group.name } </b>
	    <FeaturesTable subjects={group.subjects}
			   variables={variables}
			   meanVector={group.meanVector} />
	</div>
    )
}
