// This class is for generating creature names that are linked to the
// creature type. This tracks which creature names have already been issued to 
// avoid the name being issued again. Also randomises name order for each 
// creature type on refresh.

export default class CreatureNames {
	// One single instance per creature type.

	constructor(availableNames){

	this.availableNames = availableNames;
	this.creatureCountMax = availableNames.length;
	this.creatureTypeArrIndex = 0; // tracks index num of name issued.
	this.issuedName = '';
	this.shuffleNames(this.availableNames);
	}

	getName() {

		if(this.creatureTypeArrIndex === this.creatureCountMax) this.creatureTypeArrIndex = 0;
		// if the current index number exceeds the number of creature 
		// names in array, reset the counter back to 0 for re-issuing names.

		this.issuedName = this.availableNames[this.creatureTypeArrIndex];
		this.creatureTypeArrIndex++;
		
		return this.issuedName;
	}

	shuffleNames(array) {
		// Durstenfeld shuffle - courtesy of Stackoverflow
		for(let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
};