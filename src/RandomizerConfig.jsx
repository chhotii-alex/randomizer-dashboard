import { useState, useEffect } from 'react'
import { useURL } from './URLContext';
import ViewProtocol from './ViewProtocol';

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

    async function getProtocols() {
	let url = `${randomizerURL}/protocols`;
	try {
	    const response = await fetch(url);
	    if (!response.ok) {
		setErrorMessage("Failed to get list of protocols");
	    }
	    else {
		const results = await response.json();
		setProtocols(results);
	    }
	}
	catch {
	    setErrorMessage("Something went wrong trying to obtain list of protocols");
	}
    }

    useEffect(() => {
	getRandomizerVersion();
	getProtocols();
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
	    <hr/>
	    { Object.getOwnPropertyNames(protocols).map(
		(p) => <ViewProtocol key={p} name={p}
				     protocol={protocols[p]}/>) }
	</>
    )
}
