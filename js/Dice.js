export default class Dice {
	constructor(setDouble=false, diceToDouble=4) {
		this.setDouble = setDouble;
		this.dice1 = 0;
		this.dice2 = 0;
		this.diceToDouble = diceToDouble;
		this.currentDiceTotal = 0;
		this.doubleDice = false;
	}

	getDiceData(){
		this.doubleDice = false;
		this.dice1 = this.getRandomInt(1,6);
		this.dice2 = this.getRandomInt(1,6);
		
		if(this.setDouble===true) this.forceDoubleDice();
		if(this.dice1 === this.dice2) this.doubleDice = true;
		
		this.currentDiceTotal = this.dice1 + this.dice2;
		let diceData = {'doubleDice':  this.doubleDice, 
			'dice1': this.dice1, 'dice2': this.dice2};

		return diceData;
	}

	forceDoubleDice(){
		// This is for testing, not for cheating!!!
		if(this.diceToDouble >= 1 && this.diceToDouble <= 6){
			this.dice1 = this.diceToDouble;
			this.dice2 = this.diceToDouble;
		}
	}

	getCurrentDiceTotal(){ return this.currentDiceTotal;}

	diceIsDouble(){return this.doubleDice;}

	getDiceOne(){return this.dice1;}

	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	changeDiceImages(){
		let diceBox = document.getElementById("dice-box");
		diceBox.getElementsByTagName("img")[0].src = `images/dice${this.dice1}.png`;
		diceBox.getElementsByTagName("img")[1].src = `images/dice${this.dice2}.png`;
	}
}