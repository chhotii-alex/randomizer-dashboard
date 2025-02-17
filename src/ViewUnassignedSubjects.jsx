import useFetch from './fetching.js';
import { useURL } from './URLContext';
import FeaturesTable from './FeaturesTable';

export default function ViewUnassignedSubjects({name, variables, ticker}) {
    const randomizerURL = useURL();
    const { data, loading, error } = useFetch(`${randomizerURL}/${name}/subjects`, ticker);
    return (
	<>
	    <p className="error">{error?.message}</p>   
	    { loading ? <span>Loading...</span> :
	      <div>
		  <h3>Unassigned subjects:</h3>
		  <FeaturesTable subjects={ data.filter(s => s.groupName == null)}
			   variables={variables}/>
	      </div>
	    }
	</>
    )    
}
