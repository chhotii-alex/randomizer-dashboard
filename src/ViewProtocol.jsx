import { useURL } from './URLContext';
import { useState, useEffect } from 'react';
import ViewGroup from './ViewGroup';
import ViewVariables from './ViewVariables';

export default function ViewProtocol({name, protocol}) {
    const randomizerURL = useURL();
    const [groupList, setGroupList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [varNameList, setVarNameList] = useState([]);

    useEffect(() => {
	getGroups();
	getSubjects();
    }, [randomizerURL, name]);

    async function getGroups() {
	let url = `${randomizerURL}/${name}/groups`;
	try {
	    const response = await fetch(url);
	    if (!response.ok) {
		// TODO: deal with errors
	    }
	    else {
		const newGroupList = await response.json();
		console.log(newGroupList);
		setGroupList(newGroupList);
	    }
	}
	catch {
	    // TODO: deal with errors
	}
    }

    async function getSubjects() {
	let url = `${randomizerURL}/${name}/subjects`;
	try {
	    const response = await fetch(url);
	    if (!response.ok) {
		// TODO: deal with errors
	    }
	    else {
		const newSubjectList = await response.json();
		console.log("Subjects", newSubjectList);
		setSubjectList(newSubjectList);
	    }
	}
	catch {
	    // TODO: deal with errors
	}
    }

    return (
	<>
	    <h2> Protocol: {name}</h2>
	    <ViewVariables variables={protocol.variables} />
	    <h3>Groups:</h3>
	    { groupList.map( (g) =>
		<ViewGroup group={g} variables={protocol.variables}
			   key={g.name} />
	    )}
	    <h3>Unassigned subjects:</h3>
	    <p>
		{ subjectList.filter(s => s.groupName == null).map(
		    s => <b>{s.id}</b> )
	    }
	    </p>
	    <hr/>
	    {JSON.stringify(subjectList)}
	</>
    )
}
