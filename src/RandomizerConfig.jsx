import { useState, useEffect, useContext } from 'react'
import { useURL } from './URLContext';
import ViewProtocol from './ViewProtocol';
import ViewVersion from './ViewVersion';
import RefreshContext from './RefreshContext.js';
import useFetch from './fetching.js';
import NewProtocolPanel from './NewProtocolPanel.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

export default function RandomizerConfig() {
    const randomizerURL = useURL();
    const [ticker, setTicker] = useState(0);
    const [adding, setAdding] = useState(false);

    const { data, loading, error } = useFetch(`${randomizerURL}/protocols`, ticker);

    function refetch() {
	setTicker(Date.now());
    }

    useEffect(() => {
	const intervalToken = setInterval(refetch, 5*60*1000);
	return () => { clearInterval(intervalToken) };
    }, [randomizerURL]);

    function editNew() {
	setAdding(true);
    }

    function cancelAdding() {
	setAdding(false);
    }

    return (
	<ErrorBoundary>
	    <p className="error">{error?.message}</p>
	    <p>
         	Prospective Randomizer at: {randomizerURL}
	    </p>
	    <ViewVersion />
	    <RefreshContext.Provider value={refetch} >
		{ loading ||
		  data &&
		  Object.getOwnPropertyNames(data).map(
		      (p) => <ViewProtocol key={p} name={p}
					   protocol={data[p]}
					   ticker={ticker}
			     />) }
		<button onClick={refetch}>Refresh</button>
		<hr/>
		{ adding ?
		  <NewProtocolPanel cancelAdding={cancelAdding} />
		  :
 		  <button onClick={editNew}>Add New Protocol...</button>
		}
	    </RefreshContext.Provider>
	</ErrorBoundary>
    )
}
