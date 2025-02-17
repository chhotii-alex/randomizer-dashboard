import useFetch from './fetching.js';
import { useURL } from './URLContext';

export default function ViewVersion() {
    const randomizerURL = useURL();

    const { data, loading, error } = useFetch(`${randomizerURL}/version`, 0);

    return (
	<>
	    <p className="error">{error?.message}</p>
	    { loading ? <span>Loading...</span> :
	      <p>
		  Algorithm version: {data}
  	      </p>
	    }
	</>
    );
}
