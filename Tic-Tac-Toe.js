/**
 * @author Josh Gibbs
 */

var size = 3;
var won = false;
var moves = 0;
var xturn = true;

function doLogic(id) {
	if(!won) {
		if(document.getElementById(id).innerText === "") {

			if(document.getElementById("chk").checked) {
				//This is for serial communication only (Sends coordinates to ATMEGA firmware to add to matrix)
				document.getElementById("myPHP").src = "serialcoordinates.php?coordinate=" + (id.substring(1, 2) + id.substring(3, 4));
			}

			if(xturn) {
				if(!(document.getElementById("Xai").checked)) {
					document.getElementById(id).innerText = "X";
					checkWin();
					xturn = false;
				}
				if(document.getElementById("Oai").checked && !won) {
					AImove();
				}
			} else {
				if(!(document.getElementById("Oai").checked)) {
					document.getElementById(id).innerText = "O";
					checkWin();
					xturn = true;
				}
				if(document.getElementById("Xai").checked && !won) {
					AImove();
				}
			}
		}
	}
}

//I know the AI isn't really AI, but I want to move onto something else, it's going to be baby AI.
var randx = Math.floor(Math.random() * size);
var randy = Math.floor(Math.random() * size);
function AImove() {
	while(!(document.getElementById("x" + randx + "y" + randy).innerText === "")) {
		randx = Math.floor(Math.random() * size);
		randy = Math.floor(Math.random() * size);
	}
	//We wait to make it look like AI is thinking, but it's really just stupid...
	setTimeout("AIpostSleep()", 500);
}

function AIpostSleep() {
	if(document.getElementById("chk").checked) {
		//This is for serial communication only (Sends coordinates to ATMEGA firmware to add to matrix)
		document.getElementById("myPHP").src = "serialcoordinates.php?coordinate=" + randx + "" + randy;
	}
	if(xturn) {
		document.getElementById('x' + randx + 'y' + randy).innerText = 'X';
		xturn = false;
		checkWin();
		if(document.getElementById("Oai").checked && !won) {
			AImove();
		}
	} else {
		document.getElementById('x' + randx + 'y' + randy).innerText = 'O';
		xturn = true;
		checkWin();
		if(document.getElementById("Xai").checked && !won) {
			AImove();
		}
	}
}

function checkWin() {
	var on = "X";
	for( t = 0; t < 2; t++) {
		//Horizontal checks
		for( y = 0; y < size; y++) {
			var have = 0;
			for( x = 0; x < size; x++) {
				if(document.getElementById("x" + x + "y" + y).innerText === on) {
					have++;
				}
			}
			if(have === size) {
				for( x = 0; x < size; x++) {
					document.getElementById("x" + x + "y" + y).style.color = "red";
				}
				won = true;
				alert(on + "s won!");
			}
		}

		//Vertical checks
		for( x = 0; x < size; x++) {
			have = 0;
			for( y = 0; y < size; y++) {
				if(document.getElementById("x" + x + "y" + y).innerText === on) {
					have++;
				}
			}
			if(have === size) {
				for( y = 0; y < size; y++) {
					document.getElementById("x" + x + "y" + y).style.color = "red";
				}
				won = true;
				alert(on + "s won!");
			}
		}

		//Diagonal (top to bottom) checks
		have = 0;
		for( i = 0; i < size; i++) {
			if(document.getElementById("x" + i + "y" + i).innerText === on) {
				have++;
			}
		}
		if(have === size) {
			for( i = 0; i < size; i++) {
				document.getElementById("x" + i + "y" + i).style.color = "red";
			}
			won = true;
			alert(on + "s won!");
		}

		//Diagonal (bottom to top) checks
		y = size;
		have = 0;
		for( x = 0; x < size; x++) {
			y--;
			if(document.getElementById("x" + x + "y" + y).innerText === on) {
				have++;
			}
		}
		if(have === size) {
			y = size;
			for( x = 0; x < size; x++) {
				y--;
				document.getElementById("x" + x + "y" + y).style.color = "red";
			}
			won = true;
			alert(on + "s won!");
		}
		on = "O";
	}

	//Cats game check
	moves++;
	if(moves === size * size && !won) {
		won = true;
		alert("Cats game");
	}
}

function changeSize(s) {
	if(s === 0) {
		size++;
	} else if(s === 1) {
		if(size > 3) {
			size--;
		}
	}
	doClear();
}

function doClear() {
	if(document.getElementById("chk").checked) {
		//This is for serial communication only (Sends 'c' to ATMEGA firmware to clear matrix)
		document.getElementById("myPHP").src = "serialcoordinates.php?coordinate=c";
	}
	document.getElementById("Xai").checked = "";
	won = false;
	moves = 0;
	xturn = true;
	init();
}

function init() {
	document.getElementById("thetable").innerHTML = "";
	var table = document.createElement("table");
	table.id = "myTable";
	table.border = "5";
	var tbody = document.createElement("tbody");
	table.appendChild(tbody);
	for( i = 0; i < size; i++) {
		var row = document.createElement("tr");
		for( j = 0; j < size; j++) {
			var td = document.createElement("td");
			td.id = "x" + j + "y" + i;
			var createClickHandler = function() {
				return function() {
					doLogic(this.id);
				};
			}

			td.onclick = createClickHandler();

			row.appendChild(td);
		}
		tbody.appendChild(row);
	}
	document.getElementById("thetable").appendChild(table);
}