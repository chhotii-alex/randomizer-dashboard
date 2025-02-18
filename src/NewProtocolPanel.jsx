import {useState, useContext, useReducer } from 'react';
import { useURL } from './URLContext';
import RefreshContext from './RefreshContext.js';

export default function NewProtocolPanel({cancelAdding}) {
    const randomizerURL = useURL();
    const refreshFunction = useContext(RefreshContext);
    const [name, setName] = useState('Intervention_Trial');
    const [specs, dispatch] = useReducer(reducer, {
	algorithm: 'Balanced',
	allowRevision: true,
	groupNames: ["A", "B"],
	variableSpec: [{name: "score", type: "continuous", levels:[]}]
    });
    const errorMessage = validate();

    function validate() {
	if (!name || name.length < 1) {
	    return "name of protocol must be non-empty";
	}
	if (name.includes(' ')) return "name of protocol cannot contain spaces";
	for (const group of specs.groupNames) {
	    if (!group || group.length < 1) {
		return "group name cannot be empty";
	    }
	}
	for (const v of specs.variableSpec) {
	    console.log(v);
	    if (!v.name || v.name.length < 1) {
		return "variable name cannot be empty";
	    }
	    if (v.type == "categorical") {
		if (!v.levels || v.levels.length < 2) {
		    return "categorical variables should have at least 2 levels"
		}
		for (const levelText of v.levels) {
		    if (!levelText || levelText.length < 1) {
			return "a categorical level's label cannot be empty";
		    }
		}
		const asSet = new Set(v.levels);
		if (asSet.size < v.levels.length) {
		    return "level labels must be distinct";
		}
	    }
	}
	
	// all tests passed
	return null;
    }

    function handleNameChange(e) {
	let s = e.target.value;
	setName(s.replace(/\s/g, ''));
    }

    function reducer(specs, action) {
	if (action.type === 'changed') {
	    return {...specs, action.field:action.value};
	}
	if (action.type === 'groupName') {
	    const newGroups = specs.groupNames.slice();
	    newGroups.splice(action.index, 1, action.value);
	    return {...specs, groupNames:newGroups};
	}
	if (action.type === 'addGroup') {
	    const newGroups = specs.groupNames.slice();
	    newGroups.push('new group name');
	    return {...specs, groupNames:newGroups};
	}
	if (action.type === 'removeGroup') {
	    const newGroups = specs.groupNames.slice();
	    newGroups.splice(action.index, 1);
	    return {...specs, groupNames:newGroups};
	}
	if (action.type === 'updateVariable') {
	    const newVariables = specs.variableSpec.slice();
	    const newVariable = {...newVariables[action.index], action.field:action.value};
	    if (newVariable.type == "categorical") {
		let counter = 1;
		while (newVariable.levels.length < 2) {
		    newVariable.levels.push(`level ${counter}`);
		    counter += 1;
		}
	    }
	    newVariables.splice(action.index, 1, newVariable);
	    return {...specs, variableSpec:newVariables};
	}
	if (action.type === 'addVariable') {
	    const newVariable = {name:"new_var", type:"continuous", levels:[]};
	    const newVariables = specs.variableSpec.slice();
	    newVariables.push(newVariable);
	    return{...specs, variableSpec:newVariables};
	}
	if (action.type === 'removeVariable') {
	    const newVariables = specs.variableSpec.slice();
	    newVariables.splice(action.index, 1);
	    return {...specs, variableSpec:newVariables};
	}
	if (action.type == 'addLevel') {
	    const newVariables = specs.variableSpec.slice();
	    const newVariable = {...newVariables[action.index]};
	    newVariable.levels.push('level');
	    newVariables.splice(action.index, 1, newVariable);
	    return {...specs, variableSpec:newVariables};
	}
	if (action.type == 'changeLevel') {
	    const newLevels = specs.variableSpec[action.variableIndex].levels.slice();
	    newLevels.splice(action.levelIndex, 1, action.value);
	    const newVariable = {...specs.variableSpec[action.variableIndex], levels:newLevels}
	    const newVariables = specs.variableSpec.slice();
	    newVariables.splice(action.variableIndex, 1, newVariable);
	    return {...specs, variableSpec:newVariables};
	}
	if (action.type === 'removeLevel') {
	    const newLevels = specs.variableSpec[action.variableIndex].levels.slice();
	    newLevels.splice(action.levelIndex, 1);
	    const newVariable = {...specs.variableSpec[action.variableIndex], levels:newLevels}
	    const newVariables = specs.variableSpec.slice();
	    newVariables.splice(action.variableIndex, 1, newVariable);
	    return {...specs, variableSpec:newVariables};
	}
    }

    function handleAlgorithmChange(e) {
	dispatch({type:'changed', field:'algorithm', value:e.target.value});
    }

    function handleAllowRevisionsChange(e) {
	dispatch({type:'changed', field:'allowRevision', value:e.target.checked});
    }

    function updateGroupName(e, i) {
	dispatch({type:'groupName', index:i, value:e.target.value});
    }

    function addNewGroup() {
	dispatch({type:'addGroup'});
    }

    function removeGroupName(i) {
	dispatch({type:'removeGroup', index:i});
    }

    function updateVariableName(e, i) {
	dispatch({type:'updateVariable', index:i, field:'name', value:e.target.value});
    }

    function setSelectedType(e, i) {
	dispatch({type:'updateVariable', index:i, field:'type', value:e.target.value});
    }

    function removeVariable(i) {
	dispatch({type:'removeVariable', index:i});
    }

    function addLevel(i) {
	dispatch({type:'addLevel', index:i});
    }

    function updateLevel(e, variableIndex, levelIndex) {
	dispatch({type:'changeLevel', variableIndex:variableIndex, levelIndex:levelIndex, value:e.target.value});
    }

    function removeLevel(variableIndex, levelIndex) {
	dispatch({type:'removeLevel', variableIndex:variableIndex, levelIndex:levelIndex, value:e.target.value});
    }

    async function startProtocol() {
	let url = `${randomizerURL}/${name}/start`;
	try {
	    const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify(specs),
		headers: {
		    "Content-Type": "application/json",
		},
	    });
	    if (!response.ok) {
		console.log("got response code:", response.status);
	    }
	    else {
		refreshFunction();
		cancelAdding();
	    }
	}
	catch (error) {
	    console.log(error);
	}
    }
    
    return (
	<>
	    <h3> New Protocol Parameters </h3>
	    <div className="error">{errorMessage}</div>
	    <label>Name of new protocol:</label>
	    <input value={name} onChange={handleNameChange} />
	    <p>
		Algorithm:
		<input type="radio" id="balanced" name="algorithm" value="Balanced"
		       checked={"Balanced" === specs.algorithm}
		       onChange={handleAlgorithmChange}
		/>
		<label htmlFor="balanced">Balanced</label>
		<input type="radio" id="alternating" name="algorithm" value="Alternating"
		       checked={"Alternating" === specs.algorithm}
		       onChange={handleAlgorithmChange}
		/>
		<label htmlFor="alternating">Alternating</label>
	    </p>
	    <input type="checkbox" id="revision"
		   checked={specs.allowRevision}
		   onChange={handleAllowRevisionsChange} />
	    <label htmlFor="revision">Allow Revisions</label>
	    <div>
	    Groups:
	    { specs.groupNames.map((grp, i) =>
		<p key={i}>
		    <input value={grp} onChange={ (e) => updateGroupName(e, i) } />
		    { (specs.groupNames.length > 2) &&
		      <button onClick={ (e) => removeGroupName(i) }>Remove Group</button> }
		</p>
	    ) }
		<button onClick={addNewGroup}>Add Another Group</button>
	    </div>
	    <div>
		Variables to consider for balancing:
		{
		    specs.variableSpec.map((v, i) =>
			<div key={i}>
			    Name of variable:
			    <input value={v.name} onChange={(e) => updateVariableName(e,i) }/>
			    <select value={v.type} onChange={ e => setSelectedType(e, i) } >
				<option value="continuous">continuous (numeric)</option>
				<option value="categorical">categorical</option>
			    </select>
			    { (v.type == 'categorical') &&
			      <p>
				  Levels:
			          { v.levels.map( (level, levelIndex) =>
				      <span key={levelIndex} >
					  <br/><input value={level} onChange={e => updateLevel(e, i, levelIndex)}/>
					  { (v.levels.length > 2) && <button onClick={e => removeLevel(i, levelIndex)}>Remove Level</button> }
				      </span>) }
				  <br/>
				  <button onClick={ e => addLevel(i) }> Add Level </button>
			      </p> }
			    { (specs.variableSpec.length > 1) &&
			      <button onClick={ (e) => removeVariable(i) }>Remove Variable</button> }
			</div>
		    )
		}
		<button onClick={addNewVariable}>Add Another Variable</button>
	    </div>
	    { !errorMessage &&
	      <button onClick={startProtocol}>Start</button> }
	    <button onClick={cancelAdding}>Cancel</button>
	    { JSON.stringify(specs) }
	</>
    )
}
