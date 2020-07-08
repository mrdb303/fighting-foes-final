export default class Game{

	// Is populated with creature data.

	constructor(){
		this.creatureData=[];
		this.mode = 'Roll the Dice';
		this.eliminated = [];
 		this.creaturesGoFirst = [];
		this.creaturesGoSecond = [];
		this.sittingOut = false;
		this.fightersInGame = [];
		this.gameOver = false;
		this.waitForGameReset = false;
		this.remainCreatures = 0;
		this.doubleDice = false;
		this.dice1 = 1;
		this.dice2 = 2;
		this.diceTotal = 0;
		this.updatedTableData = [];
		this.powersLoaded = false;
		this.powersToWrite = [];
		this.fightSummaryData = [];
		this.fullMatchup = [];
		this.allTheDead = [];
	}

	loadCreatures(creatures){
		this.creatureData = creatures;
		this.resetFightingData();
	}

	gameMode(){
		return this.mode;
	}

	setMode() {
		if(this.mode === 'Roll the Dice'){
			if(this.powersLoaded === true) {
				this.mode = 'Process Power';
			} else {
				this.mode = 'Fight';
			}
		} else if(this.mode === 'Process Power'){
			this.mode = 'Fight';
		} else if(this.mode === 'Fight'){
			this.mode = 'Roll the Dice';
		}
	}

	arePowersLoaded(){
		return this.powersLoaded;
	}

	resetFightingData(){
		this.updatedTableData = [];
		let creatureData = this.creatureData;

		this.creatureData.forEach(function(item, index) {
			creatureData[index].resetFightingData();
		});
	}

	setDice(diceObj){
		this.eliminated = [];
		this.allTheDead = [];

		this.doubleDice = diceObj['doubleDice']; 
		this.dice1= diceObj['dice1'];
		this.dice2 = diceObj['dice2'];
		this.diceTotal = this.dice1 + this.dice2;
	}

	processActionButton(actionType, rowNumVal){
		if(this.gameOver === false){
			switch(actionType) {
				case('del'):
					this.deleteRow(rowNumVal);
				break;
				case('inc'):
					this.increaseHealth(rowNumVal);
				break;
				case('dec'):
					this.decreaseHealth(rowNumVal);
				break;
				default:
					alert('Command not recognised');
			}
		}
	}

	deleteRow(rowNum){
		let opponent = this.creatureData[rowNum].getOpponentIndex();
		if(opponent !== undefined && opponent !== null)this.creatureData[opponent].recordOpponentHistory();
		this.creatureData[rowNum].deleteCreatureFromGame();
	}

	increaseHealth(rowNum){
		this.creatureData[rowNum].incrementHealth(rowNum);
	}


	decreaseHealth(rowNum){
		this.creatureData[rowNum].decrementHealth(rowNum);
	}

	updateAndShuffleListOfFightersInGame(){
		this.remainCreatures = 0;
		this.fightersInGame = this.creatureData.filter((creature) => {
			return creature.isCreatureDeleted() === false}); 
	
		this.fightersInGame = this.fightersInGame.map((creature) => creature.getIndexNumber());
		this.remainCreatures = this.fightersInGame.length;
		this.fightersInGame = this.shuffleArray(this.fightersInGame);
	}

	shuffleArray(array) {
		for(let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	removeExtraCreatureIfOddNumber(){
		// Removes extra creature from current battle list. This could include a 
		// creature assigned a special power.
		this.sittingOut = false;
		if(this.remainCreatures % 2 !== 0) this.sittingOut = this.fightersInGame.pop();
	}

	calculateOpponents(){
		this.creaturesGoFirst = this.fightersInGame.slice(0,this.remainCreatures / 2);
		this.creaturesGoSecond = this.fightersInGame.slice((this.remainCreatures / 2), this.remainCreatures);
	
		for(let count=0;count<this.creaturesGoFirst.length;count++){
			this.writeCreaturesOpponent(this.creaturesGoFirst[count], this.creaturesGoSecond[count]);
			this.writeCreaturesOpponent(this.creaturesGoSecond[count], this.creaturesGoFirst[count]);
		}
		
		this.updateStrengthHealthAndPowersOnTable([...this.creaturesGoFirst, ...this.creaturesGoSecond]);
	}

	writeCreaturesOpponent(creature, opponent){
		let opponentName = this.creatureData[opponent].getName();
		this.creatureData[creature].setOpponent(opponent, opponentName);
	}

	getHealth(rowNum){
		return this.creatureData[rowNum].getHealthValue();
	}

	updateStrengthHealthAndPowersOnTable(creatureArray){
		let row = [];
	
		for(let count=0;count<creatureArray.length;count++) {
			if(this.creatureData[creatureArray[count]].isCreatureDeleted() !== true){
				row = { 'id': this.creatureData[creatureArray[count]].getIndexNumber(),
					'strength': this.creatureData[creatureArray[count]].getStrengthValue(),
					'health': this.creatureData[creatureArray[count]].getHealthValue(),
					'power': this.creatureData[creatureArray[count]].getSpecialPower(),
					'opponent': this.creatureData[creatureArray[count]].getOpponent()
				};
				this.updatedTableData.push(row);
			}
		}
	
		if(this.sittingOut !== false) {
			row = { 'id': this.creatureData[this.sittingOut].getIndexNumber(),
				'strength': this.creatureData[this.sittingOut].getStrengthValue(),
				'health': this.creatureData[this.sittingOut].getHealthValue(),
				'power': this.creatureData[this.sittingOut].getSpecialPower(),
				'opponent': "Not in the round"
			};
			this.updatedTableData.push(row);
		}
	}

	getUpdatedTableData(){
		return this.updatedTableData;
	}

	assignPowers(numOfPowers, powersIssued = []){
		let specialPowersPriorityList = this.shuffleArray(this.fightersInGame);
		this.powersLoaded = false;
		this.powersToWrite = [];
		let powerRow = [];
	
		if(numOfPowers > 0){
			this.powersLoaded = true;
	
			// Rarer powers are chosen by default if there are more powers than players.
			// The only downside of this is where a game won't end in test mode
			// if constant double sixes are thrown as 'Hide' option will 
			// perpetually occur for last two creatures.
			if(numOfPowers > this.fightersInGame.length) numOfPowers = this.fightersInGame.length;
	
			for(let count = 0; count<numOfPowers;count++) {
				this.creatureData[specialPowersPriorityList[count]].setSpecialPower(powersIssued[count]);
				powerRow = {'Row': "row" + specialPowersPriorityList[count], 'Power': powersIssued[count]};
				this.powersToWrite.push(powerRow);
			}
		}
	
		this.fightersInGame = this.shuffleArray(this.fightersInGame);
	}

	getPowerTableData(){
		return this.powersToWrite;
	}

	processEndOfGoDamage(creaturesTurn = [], opposition = []){
		// Applies the strength + dice roll penalty paid at end of battle, unless
		// creature applies 'Hide' or creature has already died (can also happen
		// when special powers are processed before battle).
		let subValue;
	
		for(let count = 0; count<creaturesTurn.length; count++) {
			if(this.creatureData[creaturesTurn[count]].canSkipAGo() === false && 
			this.creatureData[opposition[count]].canSkipAGo() === false) {
	
				// Check that opponent is not dead and is not at zero 
				// health before removing points for health 
				if(this.creatureData[opposition[count]].getHealthValue() > 0  && 
				this.creatureData[creaturesTurn[count]].getHealthValue() > 0) {
					subValue = this.creatureData[creaturesTurn[count]].getStrengthValue() + this.diceTotal;
					this.creatureData[opposition[count]].removeHealthValue(subValue);
				}
			}
		}
	}

	performFightActions(){
		this.processEndOfGoDamage(this.creaturesGoFirst, this.creaturesGoSecond);
		this.updateStrengthHealthAndPowersOnTable(this.creaturesGoSecond);
		this.updateStrengthHealthAndPowersOnTable(this.creaturesGoFirst);
		this.removeTheDead();
		
		if(this.totalOfCreaturesAlive() > 1){
			this.processEndOfGoDamage(this.creaturesGoSecond, this.creaturesGoFirst);
			this.updateStrengthHealthAndPowersOnTable(this.creaturesGoFirst);
			this.updateStrengthHealthAndPowersOnTable(this.creaturesGoSecond);
			this.removeTheDead();
		}
	}

	removeTheDead(){
		let fightersInGame = this.creatureData.filter((creature) => {
			return creature.isCreatureDeleted() === false});

		fightersInGame = fightersInGame.map((creature) => creature.getIndexNumber());
	
		for(let count=0;count<fightersInGame.length; count++){
			if(this.creatureData[fightersInGame[count]].hasCreatureJustDied() === true){
				this.deleteRow(fightersInGame[count]);
				this.eliminated.push(this.creatureData[fightersInGame[count]].getName());
				this.allTheDead.push(this.creatureData[fightersInGame[count]].getIndexNumber())
			}
		}
	}

	getTheDead(){
		return this.allTheDead;
	}

	buildFightSummary(){
		let totalFights = this.creaturesGoFirst.length;
		let row= [];
		this.fightSummaryData = [];

		for(let count=0; count<totalFights; count++){
			row = {'First': this.creatureData[this.creaturesGoFirst[count]].getCreatureSummaryAsText(),
			'FirstPower': this.creatureData[this.creaturesGoFirst[count]].getSpecialPower(),
			'Second': this.creatureData[this.creaturesGoSecond[count]].getCreatureSummaryAsText(),
			'SecondPower': this.creatureData[this.creaturesGoSecond[count]].getSpecialPower()};

			this.fightSummaryData.push(row);
		}
	}

	buildFullMatchup(){
		this.fullMatchup = [];
		let fightRound = '';

		for(let count = 0; count<this.creaturesGoFirst.length; count++) {
			fightRound = this.buildMatchupFightSummaryFull(this.creaturesGoFirst[count], this.creaturesGoSecond[count]);
			this.fullMatchup.push(fightRound);
		}
	}

	getFullMatchup(){
		return this.fullMatchup;
	}

	buildMatchupFightSummaryFull(creature, opponent){

		let preview = [{Creature1: this.creatureData[creature].getCreatureSummaryAsText(),
			Effects1: this.creatureData[creature].getPowerEffectsPreview(),
			PointsLoss1: this.predictPointsLossFromBattle(creature, opponent),
			Creature2: this.creatureData[opponent].getCreatureSummaryAsText(),
			Effects2: this.creatureData[opponent].getPowerEffectsPreview(),
			PointsLoss2: this.predictPointsLossFromBattle(opponent, creature)
		}];

		return preview;
	}


	predictPointsLossFromBattle(creature, opponent) {
		let message = 'If not already beaten, a normal fight will result in a loss of ';
		message += this.creatureData[creature].getStrengthValue() + this.diceTotal;
		message += " from the opponents health.";
	
		if(this.creatureData[creature].canSkipAGo() || this.creatureData[opponent].canSkipAGo()){
			message += "<br/>However, the fight will be skipped and no further health points will be lost.";
		}
	
		return message;
	}


	getFightSummary(){
		return this.fightSummaryData;
	}

	totalOfCreaturesAlive(){
		let aliveCreaturesCount = 0;
		let boundCreatureData = this.creatureData;
	
		this.creatureData.forEach(function(item, index) {
			if(boundCreatureData[index].isCreatureDeleted() === false) aliveCreaturesCount++; 
		});
	
		return aliveCreaturesCount;
	}

	processPowersAction(){
		this.processCreaturePowers(this.creaturesGoFirst, this.creaturesGoSecond, this.sittingOut);
		this.updateStrengthHealthAndPowersOnTable(this.creaturesGoFirst);
		this.removeTheDead();
	
		this.processCreaturePowers(this.creaturesGoSecond, this.creaturesGoFirst, this.sittingOut);
		this.updateStrengthHealthAndPowersOnTable(this.creaturesGoFirst);
		this.updateStrengthHealthAndPowersOnTable(this.creaturesGoSecond);
		this.removeTheDead();
	}

	processCreaturePowers(creaturesToProcess, opponents, sittingOut = false){

		for(let count=0;count<creaturesToProcess.length;count++){
			
			this.creatureData[creaturesToProcess[count]].setSpecialPowerVariables();
			this.creatureData[creaturesToProcess[count]].pushPowersToHistory();
			this.creatureData[creaturesToProcess[count]].processPowers();
	
			// both steal strength and can decrease health need to be performed
			// outside of processPowers() as they will affect the creature outside
			// of the object we are working with.
			this.stealStrengthIfApplicable(creaturesToProcess[count], opponents[count]);
			
			if(this.creatureData[opponents[count]].getHealthValue() !== 0 && 
			this.creatureData[creaturesToProcess[count]].canDecreaseHealth() === true){
				this.creatureData[opponents[count]].removeHealthValue(100);
			}
			// Hide/skip a go called is only relevant in actual battle. The flag for
			// the feature is set in setSpecialPowerVariables().
		}
	
		if(this.sittingOut !== false){
			if(this.creatureData[sittingOut].getSpecialPower() !== ''){
				this.creatureData[sittingOut].setSpecialPowerVariables();
				// It is part of the brief that creature's powers are not
				// processed if they are sitting out, so next line is disabled
				//this.creatureData[sittingOut].processPowers();
			}
		}
	}

	stealStrengthIfApplicable(goFirst, goSecond){
		let stolenStrength = 0;
	
		if(this.creatureData[goSecond].getStrengthValue() !== 0 && 
		this.creatureData[goFirst].canStealStrength() === true){
			stolenStrength = this.creatureData[goSecond].steal50PercentOfCreatureStrength();
			this.creatureData[goFirst].increaseStrength(stolenStrength);
			this.creatureData[goFirst].setStrengthStolenValue(stolenStrength);
		}
	}

	performFightActions(){
		this.processEndOfGoDamage(this.creaturesGoFirst, this.creaturesGoSecond);
		this.updateStrengthHealthAndPowersOnTable(this.creaturesGoSecond);
		this.updateStrengthHealthAndPowersOnTable(this.creaturesGoFirst);
		this.removeTheDead();
		
		this.processEndOfGoDamage(this.creaturesGoSecond, this.creaturesGoFirst);
		this.updateStrengthHealthAndPowersOnTable(this.creaturesGoFirst);
		this.updateStrengthHealthAndPowersOnTable(this.creaturesGoSecond);
		this.removeTheDead();
	}

	getBeatenCreaturesLastRound(){
		return this.eliminated.sort();
	}

	getWinnerNumber(){
		let fightersInGame = this.creatureData.filter((creature) => {
			return creature.isCreatureDeleted() === false});
		
		fightersInGame = fightersInGame.map((creature) => creature.getIndexNumber());
		return fightersInGame[0];
	}

	getWinnerNameAndType(id){
		let message = `<br/>${this.creatureData[id].getName()} the ${this.creatureData[id].getSpecies()}`;
		return message;
	}

	getHistory(id) {
		return this.creatureData[id].getOpponentHistoryAsString();
	}

	getPowersUsed(id){
		return this.creatureData[id].getPowersUsed();
	}

	getCreatureNameByID(id){
		return this.creatureData[id].getName();
	}

}