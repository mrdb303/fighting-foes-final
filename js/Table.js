export default class Table {

	constructor(tableData=[], creatureStats=[]){

	this.tableData = tableData; //creatureIndex
	this.creatureStats = creatureStats;
	this.cssIdName = '#table-box';
	this.tableHeadings = Array("Name","Type","Strength","Health", "Special Power", "Opponent", "Action");
	this.tablediv = document.querySelector('#table-box');
	this.tablediv.innerHTML = "";
	this.table = document.createElement('table');
	this.colourOfDeletingRow = "#8b1321";
	this.magnified_inc_dec_on = true;

	this.createHeader();
	this.createDataRows();

	}

	createHeader() {
		let cell = '';
		let head = document.createElement('thead');

		this.tableHeadings.forEach(function(item) {
			cell = document.createElement('th');
			cell.appendChild(document.createTextNode(item));
			head.appendChild(cell);
		});
	
		this.table.appendChild(head);
	}

	createDataRows() { 
		let creatureRow = '';
		let body = document.createElement('tbody');
		let populateFullRow = this.populateFullRow.bind(this);

		this.creatureStats.forEach(function(item, index) {
			creatureRow = populateFullRow(item,index);
			body.appendChild(creatureRow);
		});

		this.table.appendChild(body);
		this.tablediv.appendChild(this.table);
	}

	

	populateFullRow(indivRowData = null, index = null){
		if(indivRowData != null && index != null) {
			let row = document.createElement('tr');
			row.id = "row" + index;
	
			row.appendChild(this.createTDElementText(indivRowData['name']));
			row.appendChild(this.createTDElementImage(indivRowData['image'], indivRowData['creatureSpecies']));
			row.appendChild(this.createTDElementText(indivRowData['strength']));
			row.appendChild(this.createTDElementText(indivRowData['health']));
			row.appendChild(this.createTDElementText(indivRowData['specialPower']));
			row.appendChild(this.createTDElementText(indivRowData['opponent'])); 
			row.appendChild(this.createTDWithInputButtons(index));

			return row;
		}
	}

	createTDElementText(textValue='') {
		let cell = document.createElement('td');
		cell.appendChild(document.createTextNode(textValue));
		return cell;
	}

	createTDElementImage(imgPath=ERR_IMG, title=''){
		let cell = document.createElement('td');
		let img = document.createElement('img');
		img.src = imgPath;
		img.title = title;
		cell.appendChild(img);
		return cell;
	}

	createTDWithInputButtons(objcount){
		// Buttons in last table column for creature actions
		let tdCell = document.createElement('td');
		tdCell.appendChild(this.createTDElementInputButtons('images/delete.png', 'btn', 'del', objcount));
		tdCell.appendChild(this.createTDElementInputButtons('images/heart_inc.png', 'btn', 'inc', objcount));
		tdCell.appendChild(this.createTDElementInputButtons('images/heart_dec.png', 'btn', 'dec', objcount));
		return tdCell;
	}

	createTDElementInputButtons(imgPath=ERR_IMG, inputClass, inputName, idNumber){
		let inputType = document.createElement('input');
		inputType.className = inputClass;
		inputType.name = inputName + "" + idNumber;
		inputType.id = inputName + "" + idNumber;
		inputType.type = "image";
		inputType.value = "";
		inputType.src = imgPath;

		return inputType;
	}

	deleteTableRow(rowIDNumber){
		// A slight pause is added to the deletion process to improve the UI.
		let rowToDelete = document.getElementById("row" + rowIDNumber);
		rowToDelete.style.backgroundColor=this.colourOfDeletingRow;
	
		setTimeout(function(){ 
			rowToDelete.parentNode.removeChild(rowToDelete)
		}, 230);
	}

	deleteTheDead(list){
		if(list !== null || list.length >0){
			for(let count=0; count<list.length; count++){
				this.deleteTableRow(list[count]);
			}
		}
	}

	changeRowValWithOptionalFontSizeChange(rowIDNumber, newHealth, ms, colNum){
		const delayTime = 60;
		const origFontSize = '0.938em';
		const largeFontSize = '2em';
	
		let rowSelected = document.getElementById("row" + rowIDNumber);
		rowSelected.getElementsByTagName("td")[3].innerHTML = newHealth;
		
		if(this.magnified_inc_dec_on === true){
			rowSelected.getElementsByTagName("td")[3].style.fontSize = largeFontSize;
			setTimeout(() => {
				rowSelected.getElementsByTagName("td")[colNum].style.fontSize = origFontSize;
			}, ms);
			setTimeout(() => {}, delayTime);
		}
	}

	writeStrengthHealthAndPowers(creatureStats){
		let row = '';
		let rowSelected = '';

		creatureStats.forEach(function(item) {
			row = item;
			rowSelected = document.getElementById("row" + row['id']);
			rowSelected.getElementsByTagName("td")[2].innerHTML = row['strength'];
			rowSelected.getElementsByTagName("td")[3].innerHTML = row['health'];
			rowSelected.getElementsByTagName("td")[4].innerHTML = row['power'];;
			rowSelected.getElementsByTagName("td")[5].innerHTML = row['opponent'];
		});
	}

	updatePowersOnly(powerData){
		let rowSelected = '';

		for(let count = 0; count<powerData.length; count++){
			rowSelected = document.getElementById(powerData[count]['Row']);
			rowSelected.getElementsByTagName("td")[4].innerHTML = powerData[count]['Power'];;
		}
	}
}