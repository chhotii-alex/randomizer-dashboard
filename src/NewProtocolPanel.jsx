import {useState, useContext } from 'react';
import { useURL } from './URLContext';
import RefreshContext from './RefreshContext.js';

export default function NewProtocolPanel({cancelAdding}) {
    const randomizerURL = useURL();
    const refreshFunction = useContext(RefreshContext);
    const [name, setName] = useState('Intervention_Trial');
    const [specs, setSpecs] = useState({
	algorithm: 'Balanced',
	allowRevision: true,
	groupNames: ["A", "B"],
	variableSpec: [{name: "score", type: "continuous", levels:[]}]
    });

    function handleNameChange(e) {
	setName(e.target.value);
    }

    function handleAlgorithmChange(e) {
	setSpecs({...specs, algorithm:e.target.value});
    }

    function handleAllowRevisionsChange(e) {
	const newSpecs = {...specs, allowRevision:e.target.checked};
	setSpecs(newSpecs);
    }

    function updateGroupName(e, i) {
	const newGroups = specs.groupNames.slice();
	newGroups.splice(i, 1, e.target.value);
	const newSpecs = {...specs, groupNames:newGroups};
	setSpecs(newSpecs);
    }

    function addNewGroup() {
	const newGroups = specs.groupNames.slice();
	newGroups.push('new group name');
	setSpecs({...specs, groupNames:newGroups});
    }

    function removeGroupName(i) {
	const newGroups = specs.groupNames.slice();
	newGroups.splice(i, 1);
	setSpecs({...specs, groupNames:newGroups});
    }

    function updateVariableName(e, i) {
	const newVariables = specs.variableSpec.slice();
	const newVariable = {...newVariables[i], name:e.target.value};
	newVariables.splice(i, 1, newVariable);
	const newSpecs = {...specs, variableSpec:newVariables};
	setSpecs(newSpecs);
    }

    function addNewVariable() {
	const newVariable = {name:"new_var", type:"continous", levels:[]};
	const newVariables = specs.variableSpec.slice();
	newVariables.push(newVariable);
	const newSpecs = {...specs, variableSpec:newVariables};
	setSpecs(newSpecs);
    }

    function removeVariable(i) {
	const newVariables = specs.variableSpec.slice();
	newVariables.splice(i, 1);
	const newSpecs = {...specs, variableSpec:newVariables};
	setSpecs(newSpecs);
    }

    function setSelectedType(e, i) {
	const newVariables = specs.variableSpec.slice();
	const newVariable = {...newVariables[i], type:e.target.value};
	newVariables.splice(i, 1, newVariable);
	const newSpecs = {...specs, variableSpec:newVariables};
	setSpecs(newSpecs);
    }

    function addLevel(i) {
	const newVariables = specs.variableSpec.slice();
	const newVariable = {...newVariables[i]};
	newVariable.levels.push('level');
	newVariables.splice(i, 1, newVariable);
	const newSpecs = {...specs, variableSpec:newVariables};
	setSpecs(newSpecs);
    }

    function updateLevel(e, variableIndex, levelIndex) {
	const newLevels = specs.variableSpec[variableIndex].levels.slice();
	newLevels.splice(levelIndex, 1, e.target.value);
	const newVariable = {...specs.variableSpec[variableIndex], levels:newLevels}
	const newVariables = specs.variableSpec.slice();
	newVariables.splice(variableIndex, 1, newVariable);
	const newSpecs = {...specs, variableSpec:newVariables};
	setSpecs(newSpecs);
    }

    function removeLevel(variableIndex, levelIndex) {
	const newLevels = specs.variableSpec[variableIndex].levels.slice();
	newLevels.splice(levelIndex, 1);
	const newVariable = {...specs.variableSpec[variableIndex], levels:newLevels}
	const newVariables = specs.variableSpec.slice();
	newVariables.splice(variableIndex, 1, newVariable);
	const newSpecs = {...specs, variableSpec:newVariables};
	setSpecs(newSpecs);
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
	    <button onClick={startProtocol}>Start</button>
	    <button onClick={cancelAdding}>Cancel</button>
	</>
    )
}
