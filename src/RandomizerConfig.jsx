import { useState, useEffect, useContext } from 'react'
import { useURL } from './URLContext';
import ViewProtocol from './ViewProtocol';
import RefreshContext from './RefreshContext.js';

export default function RandomizerConfig() {
    const [version, setVersion] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [protocols, setProtocols] = useState({});
    const randomizerURL = useURL();
    
    async function getRandomizerVersion() {
	let url = `${randomizerURL}/version`;
	try {
        	const response = await fetch(url);
	     if (!response.ok) {
	         setErrorMessage("Failed to obtain version identifier");
	     }
	    else {
	       const value = await response.text();
		setVersion(value);
	    }
	}
	catch {
	    setErrorMessage("Something went wrong trying to obtain version identifier");
	}
    }

    async function fetchProtocols() {
	console.log("Doing fetchProtocols()");
	let url = `${randomizerURL}/protocols`;
	try {
	    const response = await fetch(url);
	    if (!response.ok) {
		setErrorMessage("Failed to get list of protocols");
	    }
	    else {
		const results = await response.json();
		setProtocols(results);
		setErrorMessage('');
	    }
	}
	catch {
	    setErrorMessage("Something went wrong trying to obtain list of protocols");
	}
    }

    useEffect(() => {
	getRandomizerVersion();
	fetchProtocols();
	const intervalToken = setInterval(fetchProtocols, 60*1000);
	return () => { clearInterval(intervalToken) };
    }, [randomizerURL]);

    return (
	<>
	    <p className="error">{errorMessage}</p>
	    <p>
         	Prospective Randomizer at: {randomizerURL}
	    </p>
	    <p>
		Algorithm version: {version}
	    </p>
	    <button onClick={fetchProtocols}>Refresh</button>
	    <hr/>
	    <RefreshContext.Provider value={fetchProtocols} >
         	    { Object.getOwnPropertyNames(protocols).map(
		(p) => <ViewProtocol key={p} name={p}
				     protocol={protocols[p]}/>) }
	    </RefreshContext.Provider>
	</>
    )
}
