export default class Creature {
	constructor() {
	this.creatureValid = true;
	this.creatureSpecies = '';
	this.name = '';
	this.indexNum = 0;

	this.modStrengthPlus = 0;
	this.modStrengthMinus = 0;
	this.modHealthPlus = 0;
	this.skipAGo = false;
	this.steal50PercentStrength = false;
	this.decreaseOppHealthOf100 = false;
	this.strengthStolen = 0;
	
	this.image = 'images/error.png';
	this.strength = 0;
	this.health = 0;
	this.specialPower = '';
	this.opponent = '';
	this.opponentIndexNum = null;
	this.tablerowdata = [];
	this.deleted = false;
	this.fought = [];
	this.powersUsed = [];
	}

	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	deleteCreatureFromGame() {
		this.deleted = true;
		this.specialPower = '';
		this.strength = 0;
		this.health = 0;
		this.modStrengthPlus = 0;
		this.modStrengthMinus = 0;
		this.modHealthPlus = 0;
		this.skipAGo = false;
		this.steal50PercentStrength = false;
		this.decreaseOppHealthOf100 = false;
	}

	isCreatureDeleted(){
		return this.deleted;
	}

	incrementHealth() {
		this.health++;
	}

	decrementHealth() {
		if(this.health !== 0) this.health--;
	}

	getHealthValue() {
		return this.health;
	}

	getStrengthValue(){
		return this.strength;
	}

	increaseStrength(value){
		this.strength = this.strength + value;
	}

	canStealStrength(){
		return this.steal50PercentStrength;
	}

	canDecreaseHealth(){
		return this.decreaseOppHealthOf100;
	}

	canSkipAGo(){
		return this.skipAGo;
	}

	steal50PercentOfCreatureStrength(){
		let stolenStrength = Math.floor((this.strength / 2));
		this.strength -= stolenStrength;
		return stolenStrength;
	}


	removeHealthValue(healthValue){
		if(this.health > 0) this.health -= healthValue;
		if(this.health < 0) this.health = 0;
	}

	hasCreatureJustDied() {
		if(this.health <= 0 && this.deleted === false){
			this.deleted = true;
		}
		return this.deleted;
	}

	setIndexNumber(value){
		this.indexNum = value;
	}

	getIndexNumber(){
		return this.indexNum;
	}

	getName(){
		return this.name;
	}

	getSpecies(){
		return this.creatureSpecies;
	}

	setOpponent(opponentIndexNum, creatureName){
		this.opponentIndexNum = opponentIndexNum;
		this.opponent = creatureName;
	}

	setSpecialPower(power) {
		this.specialPower = power;
	}

	getSpecialPower() {
		return this.specialPower;
	}

	pushPowersToHistory() {
		if(this.specialPower !== ''){
			this.powersUsed.push(this.specialPower);
		}
	}

	getPowersUsed(){
		let returnVal = false;
		if(this.powersUsed.length > 0) returnVal = this.powersUsed.join(', ');
		
		return returnVal;
	}

	getOpponent(){
		return this.opponent;
	}

	getOpponentIndex(){
		return this.opponentIndexNum;
	}

	getModificationData() {
		let message = '';
		if(this.modStrengthPlus !== 0) message = `Strength + ${this.modStrengthPlus}`;
		if(this.modStrengthMinus !== 0) message = `Strength - ${this.modStrengthMinus}`;
		if(this.modHealthPlus !== 0) message = `Health + ${this.modHealthPlus}`;
		if(this.skipAGo === true) message = `The fight will not take place`;
		if(this.decreaseOppHealthOf100 === true) message = 'Opponent Health - 100';
		if(this.steal50PercentStrength === true) message = `Strength Stolen = ${this.strengthStolen}`;
		return message;
	}

	resetFightingData(){
		this.opponent = '';
		this.opponentIndexNum = null;
		this.specialPower = '';
		this.modStrengthPlus = 0;
		this.modStrengthMinus = 0;
		this.modHealthPlus = 0;
		this.skipAGo = false;
		this.steal50PercentStrength = false;
		this.decreaseOppHealthOf100 = false;
		this.strengthStolen = 0;
	}

	setStrengthStolenValue(value){
		this.strengthStolen = value;
	}

	setSpecialPowerVariables() {
		if(this.specialPower !=='') {

			switch(this.specialPower){
				case 'Decreases opponents health by 100':
					this.decreaseOppHealthOf100 = true;
				break;
				case 'Increases health by 100':
					this.modHealthPlus = 100;
				break;
				case 'Increases strength between 1 - 100': 
					this.modStrengthPlus = this.getRandomInt(1, 100);
				break;
				case 'Decreases strength between 1 - 100':
					this.modStrengthMinus = this.getRandomInt(1, 100);
				break;
				case 'Hides (Skips a go)':
					this.skipAGo = true;
				break;
				case 'Steals 50% of the strength from the opponent':
					this.steal50PercentStrength = true;
				break;
			}
		}

	}

	processPowers(){
		// Only one of the powers can be processed due to game logic
		// Don't allow strength to hold a minus figure, zero is lowest
		if(this.strength > 0) {
			if(this.modStrengthMinus > 0) this.strength -= this.modStrengthMinus;
		}		
		if(this.modStrengthPlus > 0) this.strength = this.strength + this.modStrengthPlus;
		if(this.strength < 0) this.strength = 0;

		// Note: A creature cannot reduce its own health as a special power
		if(this.modHealthPlus > 0) this.health += this.modHealthPlus;
		if(this.health < 0) this.health = 0;
		
	}

	recordOpponentHistory(){
		this.fought.push(this.opponent); 
	}

	getOpponentHistoryAsString(){
		if(this.fought.length > 1){
			this.fought = this.fought.filter( (el, i, arr) => arr.indexOf(el) === i);
		}
		return this.fought.join(', ');
	}

	getTableDetailsAsArray() {
		this.tablerowdata['creatureSpecies'] = this.creatureSpecies;
		this.tablerowdata['name'] = this.name;
		this.tablerowdata['image'] = this.image; 
		this.tablerowdata['strength'] = this.strength;
		this.tablerowdata['health'] = this.health;
		this.tablerowdata['specialPower'] = this.specialPower;
		this.tablerowdata['opponent'] = this.opponent;
		return this.tablerowdata;
	}

	getCreatureSummaryAsText() {
		return `${this.name} the ${this.creatureSpecies} - Strength: ${this.strength} Health: ${this.health}`;
	}

	getPowerEffectsPreview(){
		let message = '';
		if(this.specialPower !==''){ 
			message = `Special Power: ${this.specialPower}<br/>Special Power Applied: ${this.getModificationData()}`;
		}
		return message;
	}
}