
export function allKeysForVariables(variables) {
    let keys = [];
    for (let i = 0; i < variables.length; ++i) {
	let one_var = variables[i];
	keys.push(one_var.name);
	if (one_var.type == 'categorical') {
	    for (let j = 0; j < one_var.levels.length; ++j) {
		let level = one_var.levels[j];
		let s = `${one_var.name}_is${level}`;
		keys.push(s);
	    }
	}
    }
    return keys;
}

export function valueForFeature(features, key) {
    if (features.hasOwnProperty(key)) {
	return features[key];
    }
    //must be a categorical, look for the level that's 1
    for (const feature in features) {
	if (features[feature] == 1) {
	    const fields = feature.split("_");
	    if (fields.length != 2) continue;
	    if (key == fields[0]) {
		return fields[1].substring(2);
	    }
	}
    }
}
