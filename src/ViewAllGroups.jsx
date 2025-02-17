import useFetch from './fetching.js';
import { useURL } from './URLContext';
import ViewGroup from './ViewGroup';

export default function ViewAllGroups({name, variables, ticker}) {
    const randomizerURL = useURL();
    const { data, loading, error } = useFetch(`${randomizerURL}/${name}/groups`, ticker);
    return (
	<>
	    <p className="error">{error?.message}</p>   
	    { loading ? <span>Loading...</span> :
	      <div>
  		  <h3>Groups:</h3>
		  { data.map( (g) =>
		      <ViewGroup group={g} variables={variables}
			     key={g.name} />
		  )}
	      </div>
	    }
	</>
    )    
}
