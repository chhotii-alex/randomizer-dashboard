

export default function ViewVariables({variables}) {
    return (
	<>
	    <h4>Variables:</h4>
	    {Object.getOwnPropertyNames(variables).map(
		(name) => <p key={name}>
			      <b className="thingname">{name}</b>
			      <span>{variables[name]}</span>
			  </p>)
	    }
	</>
    );
}
