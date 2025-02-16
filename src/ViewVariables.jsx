

export default function ViewVariables({variables}) {
    return (
	<>
	    <h4>Variables:</h4>
	    {variables.map(
		(v) => <p key={v.name}>
			      <b className="thingname">{v.name}</b>
			   <span>{v.type}</span>
			   { v.levels && v.levels.map( (option, index) => <em key={option}>{(index>0) && ','} {option}</em>) }
			  </p>)
	    }
	</>
    );
}
