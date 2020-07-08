
import Game from './Game.js';
import Creature from './Creature.js';
import Powers from './Powers.js';
import CreatureNames from './CreatureNames.js';
import Table from './Table.js';
import Dice from './Dice.js';
import PageControl from './PageControl.js';

// Vanilla JavaScript used. No frameworks or libraries.

"use strict";

// *** TESTING VARIABLES START HERE ***
const NUMBER_OF_CREATURES = 100;
const FORCE_DICE_MODE_FOR_TESTING = false;
const FORCED_DICE_TO_DOUBLE = 4;	// 1 to 6
// *** TESTING VARIABLES END HERE ***


class Witch extends Creature{
	constructor(name) {
		super(name);
		this.name = name;
		this.creatureSpecies = "Witch";
		this.image = 'images/witch.png';
		this.strength = this.getRandomInt(60, 80);
		this.health = this.getRandomInt(50,60);
	}
}

class Dragon extends Creature{
	constructor(name) {
		super(name);
		this.name = name;
		this.creatureSpecies = "Dragon";
		this.image = 'images/dragon.png';
		this.strength = this.getRandomInt(80, 90);
		this.health = this.getRandomInt(80, 90);
	}
}

class Snake extends Creature{
	constructor(name) {
		super(name);
		this.name = name;
		this.creatureSpecies = "Snake";
		this.image = 'images/snake.png';
		this.strength = this.getRandomInt(30, 60);
		this.health = this.getRandomInt( 30, 90);
	}
}

class Troll extends Creature{
	constructor(name) {
		super(name);
		this.name = name;
		this.creatureSpecies = "Troll";
		this.image = 'images/troll.png';
		this.strength = this.getRandomInt(22, 65);
		this.health = this.getRandomInt(60, 92);
	}
}


let creatureNameFactory = (function (creatureType = "") {
	let issuedName = '';

	return function (creatureType) {

		switch(creatureType){
			case('Witch'): 
				issuedName = witchNames.getName();
			break;
			case('Dragon'):
				issuedName = dragonNames.getName();
			break;
			case('Snake'): 
				issuedName = snakeNames.getName();
			break;
			case('Troll'):
				issuedName = trollNames.getName();
			break;
			default:
				issuedName = 'Creature type not recognised';
		}
		return issuedName;
	}
})();



let allDragonNames = [];
let allWitchNames = [];
let allTrollNames = [];
let allSnakeNames = [];
let victoryMessages = [];
let actionButtonRemoved = false;


let importDataAndRun = (callback) => {
	// Pull creature names and winning message data from JSON file

	let xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(xhttp.responseText);
		
			allWitchNames = response.Witch;
			allDragonNames = response.Dragon;
			allSnakeNames = response.Snake;
			allTrollNames = response.Troll;
			victoryMessages = response.VictoryMessages;
			callback();
		}	
	};

	xhttp.open("GET", "data/gamedata.json", true);
	xhttp.send();
}


let getRandomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

let winningMessage = (allWinningMessages=[]) => {
	let randomInt = getRandomInt(0,(allWinningMessages.length-1));
	if(allWinningMessages.length === 0) return "Error: No winning message found";
	return allWinningMessages[randomInt];
}



let witchNames;
let dragonNames;
let snakeNames;
let trollNames;
let creatureData = [];

// If number of creature types are added to, add the creature type to the
// following array - also add the type to the creatureNameFactory and main
// creature type creation classes.
let availableCreatures = ['Witch','Dragon','Snake','Troll'];

let maxNumberOfCreaturesAvailable = availableCreatures.length;
let powers;
let dice;
let gameOver = false;
let creatureTable = '';
const ERR_IMG = 'images/error.png';

document.getElementById('btn-reset').addEventListener('click', resetPage);
document.getElementById('btn-action').addEventListener('click', rollDiceProcessPowerOrFight);

let modal = document.getElementById("modal-box");
let span = document.getElementsByClassName("close")[0];

// The reset button
function resetPage(){
	location.reload();
}

// Modal functions
span.onclick = function() {
	modal.style.display = "none";
}

window.onclick = function(event) {
	if (event.target === modal) {
		modal.style.display = "none";
	}
}

function assignActionToTableInputElements(){
	let allButtonsInTable = document.getElementsByClassName('btn'); 
	
	for(let count = 0; count<allButtonsInTable.length; count++){
		allButtonsInTable[count].addEventListener('click',processActionButtonClick);
	}
}


let game = new Game();
let page = new PageControl();

importDataAndRun(mainEntryPoint);



// Functions beyond this point.

function mainEntryPoint() {
	// This is the callback once data is fetched. We need to ensure the
	// name data has been read in before we can manipulate it.

	let errorFound = false;
	let randomCreatureType;
	let randomCreatureNumber;
	let creatureNameFound = '';

	witchNames = new CreatureNames(allWitchNames);
	dragonNames = new CreatureNames(allDragonNames);
	snakeNames = new CreatureNames(allSnakeNames);
	trollNames = new CreatureNames(allTrollNames);

	powers = new Powers();

	// Loop for creation of creatures and creature names.

	for(let count=0; count<NUMBER_OF_CREATURES; count++){

		randomCreatureNumber = getRandomInt(0, maxNumberOfCreaturesAvailable - 1);
		randomCreatureType = availableCreatures[randomCreatureNumber];
		creatureNameFound = creatureNameFactory(randomCreatureType);

		switch(randomCreatureType) {
			case("Witch"):
				creatureData.push(new Witch(creatureNameFound));
			break;
			case("Dragon"):
				creatureData.push(new Dragon(creatureNameFound));
			break;
			case("Snake"):
				creatureData.push(new Snake(creatureNameFound));
			break;
			case("Troll"):
				creatureData.push(new Troll(creatureNameFound));
			break;
			default:
				errorFound = true;
		}

		if(errorFound === false) {
			creatureData[count].setIndexNumber(count);
		}
	}

	let creatureStats = [];
	let indivRowData  = '';

	creatureData.forEach(function(item) {
		indivRowData = item.getTableDetailsAsArray();
		creatureStats.push(indivRowData);
	});

	creatureTable = new Table(creatureData, creatureStats);
	dice = new Dice(FORCE_DICE_MODE_FOR_TESTING, FORCED_DICE_TO_DOUBLE);

	game.loadCreatures(creatureData);
	assignActionToTableInputElements();
	game.updateAndShuffleListOfFightersInGame();
}



// Listener events set up in this section

function processActionButtonClick(e){
	// If only one creature remains, we don't want to give the user the
	// option to delete the creature, as it will make a nonsense of
	// the winning text, images and last creature eliminated message shown
	// on the page. Therefore we must ensure that 'gameOver' is not true 
	// before allowing the action buttons to process input. 

	if(gameOver === false){
		let idstr = e.currentTarget.id; // choose the parent id
		let actionType = idstr.slice(0,3);
		let rowNumVal = parseInt(idstr.replace(actionType,""));

		game.processActionButton(actionType, rowNumVal);
		let healthValue = game.getHealth(rowNumVal);
	
		if(actionType === 'del') creatureTable.deleteTableRow(rowNumVal);
		if(actionType === 'inc' || actionType === 'dec') creatureTable.changeRowValWithOptionalFontSizeChange(rowNumVal, healthValue, 90, 3);
	
		page.displayCreatureCount(game.totalOfCreaturesAlive());

		if(game.totalOfCreaturesAlive() === 1) endTheGame();
	}
}




// Main game logic and loop once creature table has been pushed to
// screen for the first time.
// These are the three main game modes (three functions listed
// directly beneath).
// Please remember that the game could also be ended by the use of the delete 
// character action button on the second last remaining creature in the table.
function rollDiceProcessPowerOrFight(){
	let mode = game.gameMode();

	page.displayCreatureCount(game.totalOfCreaturesAlive());
	if(game.totalOfCreaturesAlive() === 1) endTheGame();
	
	if(mode === 'Roll the Dice'){ 
		rollTheDice();
		game.setMode();
		
	} else if(mode === 'Process Power') {
		game.processPowersAction();

		game.buildFullMatchup();
		let matchup = [];
		matchup = game.getFullMatchup();
		page.outputFullMatchup(matchup);
		creatureTable.writeStrengthHealthAndPowers(game.getUpdatedTableData());
		game.setMode();
		
	} else if(mode === 'Fight') {
		fightAction();
		game.setMode();
	}

	page.displayCreatureCount(game.totalOfCreaturesAlive());
	if(game.totalOfCreaturesAlive() === 1) endTheGame();
	if(gameOver === false) document.getElementById('btn-action').value = game.gameMode();
}


// First of three game modes triggered by rollDiceProcessPowerOrFight()
function rollTheDice(){
	page.clearCasualties();
	powers.clearPowers();

	let diceData = dice.getDiceData();
	if(diceData['doubleDice'] === true) powers.setPowers(diceData['dice1']);
	game.setDice(diceData);
	dice.changeDiceImages();
	game.resetFightingData();

	checkForPowersAndUpdatePowersOnPage();
	game.updateAndShuffleListOfFightersInGame();
	assignPowers();
	
	if(game.arePowersLoaded() === true) creatureTable.updatePowersOnly(game.getPowerTableData());
	
	game.removeExtraCreatureIfOddNumber();
	game.calculateOpponents();
	creatureTable.writeStrengthHealthAndPowers(game.getUpdatedTableData());
	game.buildFightSummary();
	page.outputBasicFightSummary(game.getFightSummary());

	if(game.totalOfCreaturesAlive() === 1) endTheGame();
}


// Third of three game modes triggered by rollDiceProcessPowerOrFight()
function fightAction(){
	let casulaties = document.getElementById('casualties');
	casulaties.innerHTML = '';
	game.performFightActions();
	creatureTable.writeStrengthHealthAndPowers(game.getUpdatedTableData());
	creatureTable.deleteTheDead(game.getTheDead());
	casulaties.style.display = 'block';
	casulaties.appendChild(page.outputEliminatedCreatures(game.getBeatenCreaturesLastRound()));

	if(gameOver === false) page.clearExistingHTMLOfDivId('output');

	if(game.totalOfCreaturesAlive() === 1) endTheGame();
}

function endTheGame(){
	if(gameOver === false) {
		let winnerId = game.getWinnerNumber();
		actionButtonRemoved = page.removeActionButtons(actionButtonRemoved);
		page.greyOutRemainingTableActionButtons(winnerId);
		page.displayTrophyAndMedal();
		let winnerMessage = winningMessage(victoryMessages);
		let creatureDetails = game.getWinnerNameAndType(winnerId)+ ' ' + winnerMessage;
		let powers = game.getPowersUsed(winnerId);
		let name = game.getCreatureNameByID(winnerId);
		page.displayWinnerMessage(creatureDetails, game.getHistory(winnerId), powers, name);
	}
	gameOver = true;
}

function assignPowers(){
	let powersIssued = [];
	let powersToFetch = powers.getNumberOfPowersAssigned();
	if(powersToFetch > 0){
		powersIssued = powers.getPowers();
	}
	game.assignPowers(powersToFetch, powersIssued);
}

// Updates powers and displays 'Special Power(s)' image if required. Uses two 
// 'Special Powers' image versions, singular and plural.
function checkForPowersAndUpdatePowersOnPage(){
	let specialPowers = [];
	if(dice.diceIsDouble() === true) {
		powers.setPowers(dice.getDiceOne());
		specialPowers = powers.getPowers();
	}

	page.updatePowersOnPage(dice.diceIsDouble(), dice.getDiceOne(), specialPowers);
}