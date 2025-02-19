import {useState, useContext, useReducer } from 'react';
import { useURL } from './URLContext';
import RefreshContext from './RefreshContext.js';

function allUnique(list) {
    const asSet = new Set(list);
    return asSet.size == list.length;
}

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
	if (!allUnique(specs.groupNames)) {
	    return "group names must be distinct";
	}
	if (!allUnique(specs.variableSpec.map(v => v.name))) {
	    return "variable names must be distinct";
	}
	for (const v of specs.variableSpec) {
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
		if (!allUnique(v.levels)) {
		    return "level labels must be distinct";
		}
	    }
	}
	
	// all tests passed
	return null;
    }

    function reducer(specs, action) {
	// scaler properties of variableSpec
	if (action.type === 'changed') {
	    let newSpecs = {...specs}
	    newSpecs[action.field] = action.value;
	    return newSpecs;
	}
	// list of group names
	else if (['groupName', 'addGroup', 'removeGroup'].includes(action.type)) {
	    const newGroups = specs.groupNames.slice();
	    if (action.type === 'groupName') {
		newGroups.splice(action.index, 1, action.value);
	    }
	    if (action.type === 'addGroup') {
		newGroups.push('new group name');
	    }
	    if (action.type === 'removeGroup') {
		newGroups.splice(action.index, 1);
	    }
	    return {...specs, groupNames:newGroups};
	}
	else {
	    //list of variables
	    const newVariables = specs.variableSpec.slice();
	    if (action.type === 'addVariable') {
		const newVariable = {name:"new_var", type:"continuous", levels:[]};
		newVariables.push(newVariable);
	    }
	    else if (action.type === 'removeVariable') {
		newVariables.splice(action.variableIndex, 1);
	    }
	    else {
		//modifying existing variable
		const newVariable = {...newVariables[action.variableIndex]}
		//variables have scalar properties
		if (action.type === 'updateVariable') {
		    newVariable[action.field] = action.value;
		    if (newVariable.type == "categorical") {
			let counter = 1;
			while (newVariable.levels.length < 2) {
			    newVariable.levels.push(`level ${counter}`);
			    counter += 1;
			}
		    }
		}
		else {
		    // variable's list of levels
		    const newLevels = newVariable.levels.slice();
		    if (action.type == 'addLevel') {
			newLevels.push('level');
		    }
		    if (action.type == 'changeLevel') {
			newLevels.splice(action.levelIndex, 1, action.value);
		    }
		    if (action.type === 'removeLevel') {
			newLevels.splice(action.levelIndex, 1);
		    }
		    newVariable.levels = newLevels;
		}
		newVariables.splice(action.variableIndex, 1, newVariable);
	    }
	    return {...specs, variableSpec:newVariables};
	}
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
	<fieldset>
	    <legend> New Protocol Parameters </legend>
	    <div className="error">{errorMessage}</div>
	    <label>Name of new protocol:</label>
	    <input value={name} onChange={e => setName(e.target.value.replace(/\s/g, ''))} />
	    <p>
		Algorithm:
		{ ["Balanced", "Alternating"].map( alg =>
		    <span key={alg}>
			<input type="radio" id={alg} name="algorithm" value={alg}
			       checked={alg === specs.algorithm}
			       onChange={e => dispatch({type:'changed', field:'algorithm', value:alg})}
			/>
			<label htmlFor={alg}>{alg}</label>
		    </span>) }
	    </p>
	    <input type="checkbox" id="revision"
		   checked={specs.allowRevision}
		   onChange={e => dispatch({type:'changed', field:'allowRevision', value:e.target.checked})} />
	    <label htmlFor="revision">Allow Revisions</label>
	    <fieldset>
		<legend>Groups:</legend>
	    { specs.groupNames.map((grp, i) =>
		<p key={i}>
		    <input value={grp} onChange={ e => dispatch({type:'groupName', index:i, value:e.target.value}) } />
		    { (specs.groupNames.length > 2) &&
		      <button onClick={ e => dispatch({type:'removeGroup', index:i}) }>Remove Group</button> }
		</p>
	    ) }
		<button onClick={e => dispatch({type:'addGroup'})}>Add Another Group</button>
	    </fieldset>
	    <div>
		Variables to consider for balancing:
		{
		    specs.variableSpec.map((v, i) =>
			<fieldset key={i}>
			    <legend>{v.name}</legend>
			    Name of variable:
			    <input value={v.name}
				   onChange={e => dispatch({type:'updateVariable', variableIndex:i, field:'name', value:e.target.value}) }/>
			    <select value={v.type}
				    onChange={ e => dispatch({type:'updateVariable', variableIndex:i, field:'type', value:e.target.value}) } >
				<option value="continuous">continuous (numeric)</option>
				<option value="categorical">categorical</option>
			    </select>
			    { (v.type == 'categorical') &&
			      <fieldset>
				  <legend>Levels:</legend>
			          { v.levels.map( (level, levelIndex) =>
				      <span key={levelIndex} >
					  <br/><input value={level}
						      onChange={e => dispatch({type:'changeLevel', variableIndex:i, levelIndex:levelIndex, value:e.target.value})}/>
					  { (v.levels.length > 2) &&
					    <button onClick={e => dispatch({type:'removeLevel', variableIndex:i, levelIndex:levelIndex})}>Remove Level</button> }
				      </span>) }
				  <br/>
				  <button onClick={ e => dispatch({type:'addLevel', variableIndex:i}) }> Add Level </button>
			      </fieldset> }
			    { (specs.variableSpec.length > 1) &&
			      <button onClick={ e => dispatch({type:'removeVariable', variableIndex:i}) }>Remove Variable</button> }
			</fieldset>
		    )
		}
		<button onClick={e => dispatch({type:'addVariable'})}>Add Another Variable</button>
	    </div>
	    { !errorMessage &&
	      <button onClick={startProtocol}>Start</button> }
	    <button onClick={cancelAdding}>Cancel</button>
	</fieldset>
    )
}
