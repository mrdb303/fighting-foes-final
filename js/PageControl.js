export default class PageControl {

	// Controls output to web page and performs DOM manipulation
	constructor(){
		this.fightDiv = 'fight';
		this.powerDiv = 'powers-box';
		this.outputDiv = 'output';
		this.specialDiv = 'special';
		this.diceDiv = 'dice-box';
		this.countDiv = 'count';
	}

	// Generic
	OutputArrayToDivIdAsUnorderedList(idName, arrToConvert=[]){
		let divElement = document.getElementById(idName);
		let ulElem = document.createElement("ul");

		arrToConvert.forEach(function(item){
			let para = document.createElement("li");
			para.innerHTML = item;
			ulElem.appendChild(para);
		});

		divElement.appendChild(ulElem);
	}

	// Generic
	clearExistingHTMLOfDivId(idName){
		let cssDiv = document.getElementById(idName);
		cssDiv.innerHTML = '';
	}

	// Generic
	wrapInPTags(text = '', pClass = null){
		let pTagString = document.createElement('p');
		if(pClass !== null) pTagString.className += pClass;
		pTagString.innerHTML = text;

		return pTagString;
	}

	outputBasicFightSummary(fightSummary){
		let basicMatchup = document.getElementById(this.outputDiv);
		basicMatchup.innerHTML = '';
		let fightContainer = '';

		for(let count = 0; count<fightSummary.length; count++) {

			fightContainer = document.createElement('div');
			fightContainer.className=this.fightDiv;

			// Both fighters
			fightContainer = this.basicFighterStats(fightContainer, fightSummary[count]['First'], fightSummary[count]['FirstPower']);
			fightContainer.appendChild(this.wrapInPTags('vs', 'head'));
			fightContainer = this.basicFighterStats(fightContainer, fightSummary[count]['Second'], fightSummary[count]['SecondPower']);
			basicMatchup.appendChild(fightContainer);
		}
	}

	basicFighterStats(container, creature, power){
		container.appendChild(this.wrapInPTags(creature, 'head'));
		if(power !== '') container.appendChild(this.wrapInPTags(power, 'power'));
		return container;
	}

	outputFullMatchup(matchup){	
		let fullMatchup = document.getElementById(this.outputDiv);
		fullMatchup.innerHTML = '';
		let fightContainer = '';
		let row =[];

		let max = this.objectLength(matchup);
		for(let count = 0; count<max; count++) {

			fightContainer = document.createElement('div');
			fightContainer.className= this.fightDiv;
			row = matchup[count];

			fightContainer = this.fullFighterStats(fightContainer, row[0]['Creature1'], row[0]['Effects1'], row[0]['PointsLoss1']);
			fightContainer.appendChild(this.wrapInPTags('vs', 'head'));
			fightContainer = this.fullFighterStats(fightContainer, row[0]['Creature2'], row[0]['Effects2'], row[0]['PointsLoss2']);
			fullMatchup.appendChild(fightContainer);
		}
	}

	fullFighterStats(container,creature, effects, pointsLoss){
		container.appendChild(this.wrapInPTags(creature, 'head'));
		if(effects !== '') container.appendChild(this.wrapInPTags(effects, 'power'));
		container.appendChild(this.wrapInPTags(pointsLoss, 'result'));
		return container;
	}

	outputEliminatedCreatures(eliminated){
		let message = '';
		let count = eliminated.length;

		if(count > 0) {		
			if(count === 1){
				message = this.wrapInPTags(`${count} creature was eliminated through battle in the last round: <br/><br/>${eliminated.toString()}`);
			} else {
				let arrAsString = eliminated.join(', ');
				message = this.wrapInPTags(`${count} creatures were eliminated through battle in the last round: <br/><br/>${arrAsString}`);
			}
		} else {
			message = this.wrapInPTags('No creatures were eliminated through battle in the last round');
		}
		return message;
	}

	displayCreatureCount(aliveCreaturesCount){
		let message = '';
	
		if(aliveCreaturesCount > 1) message = `<h3>${aliveCreaturesCount} worthy 
		adversaries remain in battle</h3>`;
	
		if(aliveCreaturesCount === 1) {
			message = "<h3>Only the true victor remains</h3>";
			this.clearExistingHTMLOfDivId(this.outputDiv);
		}
	
		let countBox = document.getElementById(this.countDiv);
		countBox.innerHTML = message;
	}

	displayTrophyAndMedal(){
		let cssDiv = document.getElementById(this.diceDiv);
		cssDiv.getElementsByTagName("img")[0].src = 'images/trophy.png';
		cssDiv.getElementsByTagName("img")[1].src = 'images/blank.png';
		cssDiv.style.display ='block';
	
		cssDiv = document.getElementById(this.powerDiv);
		cssDiv.style.display ='none';
	
		cssDiv = document.getElementById(this.specialDiv);
		cssDiv.getElementsByTagName("img")[0].src = 'images/firstplace.png';
	}

	removeActionButtons(actionButtonRemoved){
		if(actionButtonRemoved  === false){
			actionButtonRemoved  = true;
	
			// Removes the action button so only 'reset' is selectable. 
			let buttonElement = document.getElementById("btn-action");
			buttonElement.remove();
	
			// Reveals modal and hides special powers CSS div 
			let modal = document.getElementById("modal-box");
			modal.style.display = "block";
			let powerBox = document.getElementById(this.powerDiv);
			powerBox.style.display ='none';
		}
		return actionButtonRemoved;
	}

	greyOutRemainingTableActionButtons(idNum){
		let element = document.getElementById('inc' + idNum).src = 'images/heart_inc_grey.png';
		element = document.getElementById('dec' + idNum).src = 'images/heart_dec_grey.png';
	}

	displayWinnerMessage(creatureDetails, history, powers, name){
		let gameWorkings = document.getElementById("win");
		gameWorkings.innerHTML = '';
		gameWorkings.style.display ='block';
	
		gameWorkings.appendChild(this.wrapInPTags('W I N N E R !', 'head'));
		gameWorkings.appendChild(this.wrapInPTags(creatureDetails));
	
		// Opponents defeated may not equate to number of fighting rounds
		// as not all rounds result in a creature being eliminated.
		gameWorkings.appendChild(this.wrapInPTags(`<br/>Opponents defeated: 
		${history}`));
		
		if(powers !== false) {
			gameWorkings.appendChild(this.wrapInPTags(`<br/>Powers used: ${powers}.`));
		} else {
			gameWorkings.appendChild(this.wrapInPTags(`<br/>There was no need for 
			${name} to resort to the use of special 
			powers to prove superiority.`));
		}
	}

	clearCasualties(){
		let casulaties = document.getElementById('casualties');
		casulaties.innerHTML = '';
		casulaties.style.display = 'none';
	}

	updatePowersOnPage(isDouble = false, diceValue = 0, powers = []){
		this.clearExistingHTMLOfDivId(this.powerDiv);
		let specialBox = document.getElementById(this.specialDiv);
	
		if(isDouble === true) {
			let powerImageName = "";
			(diceValue === 1)? powerImageName = "spower.png" : powerImageName = "spowers.png";
			specialBox.getElementsByTagName("img")[0].src = `images/${powerImageName}`;
			this.OutputArrayToDivIdAsUnorderedList(this.powerDiv, powers);
	
		} else {
			specialBox.getElementsByTagName("img")[0].src = "images/blank.png";
		}
	}

	objectLength(obj) {
	var total = 0;
		for(var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				total++;
			}
		}
		return total;
	}
}