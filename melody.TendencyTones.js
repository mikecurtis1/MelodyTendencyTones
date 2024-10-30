const selectRandom = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const pitches = [0,1,2,3,4,5,6,7,8,9,10];

const mapABC = ['B,','C','D','E','F','G','A','B','c','d','e'];

const mapSPN = ['B3,','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5'];

const expressABC = function(melody) {
	return melody.map((n) => mapABC[n]).join(' ');
};

const expressSPN = function(melody) {
	return melody.map((n) => mapSPN[n]).join(' ');
};

const repeatedContour = function(melody, next) {
	let repeatedContour = false;
	if ( melody.length >= 2 && ( ( next === melody[melody.length-1] ) || ( next === melody[melody.length-2] ) ) ) {
		repeatedContour = true;
	}
	return repeatedContour;
}

const exceedsRange = function(next) {
	let exceedsRange = false;
	if ( next < 0 || next > 10 ) {
		exceedsRange = true;
	}
	return exceedsRange;
}

const excessiveTendencyTones = function(melody, next) {
	let excessiveTendencyTones = false;
	let tendencyTones = [0,2,4,6,7,9];
	if ( melody.length >= 1 && ( tendencyTones.includes(next) && tendencyTones.includes(melody[melody.length-1]) && tendencyTones.includes(melody[melody.length-2]) ) ) {
	console.log(melody[melody.length-2] + ' ' + melody[melody.length-1] + ' next:' + next);
		excessiveTendencyTones = true;
	}
	return excessiveTendencyTones;
}

const getNextPitch = function(melody) {
	//console.log('getNextPitch: melody: ' + melody);
	let availablePitches = [];
	let penultimate = null;
	let last = melody[melody.length-1];
	if ( melody.length > 1 ) {
		penultimate = melody[melody.length-2];
	}
	if ( last === 0 ) {
		availablePitches.push(1);
		availablePitches.splice(availablePitches.length, 0, 2,4,6,7);
	} else if ( last === 1 ) {
		//availablePitches.splice(availablePitches.length, 0, 3,5,8); // weighted tonic chord tones
		availablePitches.splice(availablePitches.length, 0, 0,2); // weight moves by single step
		availablePitches.splice(availablePitches.length, 0, 0,2,3,4,5,6,8); // all moves within an octave excluding a seventh
	} else if ( last === 2 ) {
		availablePitches.push(1); // normal resolution of tendency
		availablePitches.splice(availablePitches.length, 0, 0,4,6,7,9); // move to another tendency tone
		if ( penultimate === 1 ) {
			availablePitches.push(3); // allowed move contrary to tendency 
		}
	} else if ( last === 3 ) {
		availablePitches.splice(availablePitches.length, 0, 2,4);
		availablePitches.splice(availablePitches.length, 0, 0,1,2,4,5,6,7,8,10);
	} else if ( last === 4 ) {
		availablePitches.push(3);
		availablePitches.splice(availablePitches.length, 0, 0,2,6,7,9);
		if ( penultimate === 3 ) {
			availablePitches.push(5);
		}
	} else if ( last === 5 ) {
		availablePitches.splice(availablePitches.length, 0, 4,6);
		availablePitches.splice(availablePitches.length, 0, 0,1,2,3,4,6,7,8,9,10);
	} else if ( last === 6 ) {
		availablePitches.push(5);
		availablePitches.splice(availablePitches.length, 0, 2,4,7,9);
		if ( penultimate === 5 ) {
			availablePitches.push(7);
		}
	}	else if ( last === 7 ) {
		availablePitches.push(8);
		availablePitches.splice(availablePitches.length, 0, 0,2,4,6,9);
		if ( penultimate === 8 ) {
			availablePitches.push(6);
		}
	} else if ( last === 8 ) {
		availablePitches.splice(availablePitches.length, 0, 7,9);
		availablePitches.splice(availablePitches.length, 0, 1,3,4,5,6,7,9,10);
	} else if ( last === 9 ) {
		availablePitches.push(8);
		availablePitches.splice(availablePitches.length, 0, 2,4,6,7);
		if ( penultimate === 8 ) {
			availablePitches.push(10);
		}
	} else if ( last === 10 ) {
		availablePitches.splice(availablePitches.length, 0, 9);
		availablePitches.splice(availablePitches.length, 0, 3,5,6,7,8,9);
	} else {
		// availablePitches.push(5);
	}
	//console.log('getNextPitch: ' + availablePitches);
	let next = selectRandom(availablePitches);
	//console.log('getNextPitch: Next:' + next);
	return next;
}

const addCadence = function(melody) {
	// first resolve any tendency tone
	let last = melody[melody.length-1];
	//console.log('Last:' + last);
	//console.log('Cadence: resolve tendency tone or stop on tonic chord tone');
	if ( last === 0 ) {
		melody.push(1);
	} else if ( last === 2 ) {
		melody.push(1);
	} else if ( last === 4 ) {
		melody.push(3); // IAC
	} else if ( last === 6 ) {
		melody.push(5);
	} else if ( last === 7 ) {
		melody.push(8);
	} else if ( last === 9 ) {
		melody.push(8);
	}
	// continue with a cadence
	if ( selectRandom(Array(true,false)) ) {
		// option #1 extend with half cadence
		last = melody[melody.length-1];
		//console.log('Last extended:' + last);
		//console.log('Cadence: add half cadence');
		if ( last === 1 ) {
			melody.push(selectRandom(Array(0,2)));
		} else if ( last === 3 ) {
			melody.push(2);
		} else if ( last === 5 ) {
			melody.push(5);
		} else if ( last === 8 ) {
			melody.push(selectRandom(Array(7,9)));
		} else if ( last === 10 ) {
			melody.push(9);
		}
	} else {
		if ( selectRandom(Array(true,false)) ) {
			// option #2 extend with authentic cadence
			last = melody[melody.length-1];
			//console.log('Last extended:' + last);
			//console.log('Cadence: authentic cadence');
			if ( last === 1 ) {
				melody.push(0);
				melody.push(1);
			} else if ( last === 3 ) {
				melody.push(2);
				melody.push(1);
			} else if ( last === 5 ) {
				melody.push(4);
				melody.push(3);
			} else if ( last === 8 ) {
				melody.push(7);
				melody.push(8);// IAC
			} else if ( last === 10 ) {
				melody.push(9);
				melody.push(8);
			}
		}
	}
	return melody;
}

const buildMelody = function() {
	let first = selectRandom(Array(1,5,8));
	//console.log('First:' + first);
	let melody = [];
	melody.push(first);
	for ( let i = 0; i < 8; i++ ) {
		let next = getNextPitch(melody);
		while ( repeatedContour(melody, next) || exceedsRange(next) || excessiveTendencyTones(melody, next) ) {
			//console.log('Prohibited progression, choose again.');
			next = getNextPitch(melody);
		}
		melody.push(next);
	}
	return melody;
}

//let line = buildMelody();
//line = addCadence(line);
//console.log(expressABC(line));
