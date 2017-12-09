var mill;
var res;
var s = 512;
var w_pawn;
var w_knight;
var w_bishop;
var w_castle;
var w_queen;
var w_king;
var b_pawn;
var b_knight;
var b_bishop;
var b_castle;
var b_queen;
var b_king;
var oldGrid;
var hist = "";
var ohist = "";

function setup() {
	mill = millis();
	var cnv = createCanvas(s, s);
  var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
  cnv.position(x, y);

	noStroke();
	w_pawn = loadImage("w_pawn.png");
	w_knight = loadImage("w_knight.png");
	w_bishop = loadImage("w_bishop.png");
	w_castle = loadImage("w_castle.png");
	w_queen = loadImage("w_queen.png");
	w_king = loadImage("w_king.png");
	b_pawn = loadImage("b_pawn.png");
	b_knight = loadImage("b_knight.png");
	b_bishop = loadImage("b_bishop.png");
	b_castle = loadImage("b_castle.png");
	b_queen = loadImage("b_queen.png");
	b_king = loadImage("b_king.png");
}

function draw() {
	if(millis() - mill > 200) {
		hist = "";
		var deviceID = "2a0022001247343438323536";
		var accessToken = "0d682b52fcda6b47156553ec7c00a39f98449203";
		var varName = "outputGrid";

		requestURL = "https://api.spark.io/v1/devices/" + deviceID + "/" + varName + "/?access_token=" + accessToken;
		$.getJSON(requestURL, function(json) {
						 res = json.result;
						 var ws = 0;
						 var bs = 0;
						 var piece;

						 for(var i = 0; i < 8; i++) {
				 			for (var j = 0; j < 8; j++) {
								//draw square
								if(i%2 == 0 && j%2 == 0) {
									fill(140, 101, 0);
								} else if(i%2 == 0 && j%2 == 1) {
									fill(254, 233, 196);
								} else if(i%2 == 1 && j%2 == 0) {
									fill(254, 233, 196);
								} else if(i%2 == 1 && j%2 == 1) {
									fill(140, 101, 0);
								}
								rect(j*(s)/8,(7-i)*((s)/8),(s/8),(s/8));
								//draw piece
								if(res[(i*8+j)] == 1) {
									image(w_pawn, j*(s/8), (7-i)*(s/8));
									ws++;
								} else if(res[(i*8+j)] == 2) {
									image(w_knight, j*(s/8), (7-i)*(s/8));
									ws+=3;
								} else if(res[(i*8+j)] == 3) {
									image(w_bishop, j*(s/8), (7-i)*(s/8));
									ws+=3;
								} else if(res[(i*8+j)] == 4) {
									image(w_castle, j*(s/8), (7-i)*(s/8));
									ws+=5;
								} else if(res[(i*8+j)] == 5) {
									image(w_queen, j*(s/8), (7-i)*(s/8));
									ws+=9;
								}else if(res[(i*8+j)] == 6) {
									image(w_king, j*(s/8), (7-i)*(s/8));
								} else if(res[(i*8+j)] == 7) {
									image(b_pawn, j*(s/8), (7-i)*(s/8));
									bs++;
								} else if(res[(i*8+j)] == 8) {
									image(b_knight, j*(s/8), (7-i)*(s/8));
									bs+=3;
								} else if(res[(i*8+j)] == 9) {
									image(b_bishop, j*(s/8), (7-i)*(s/8));
									bs+=3;
								} else if(res[(i*8+j)] == "A") {
									image(b_castle, j*(s/8), (7-i)*(s/8));
									bs+=5;
								} else if(res[(i*8+j)] == "B") {
									image(b_queen, j*(s/8), (7-i)*(s/8));
									bs+=9;
								}else if(res[(i*8+j)] == "C") {
									image(b_king, j*(s/8), (7-i)*(s/8));
								}
				 			}
				 		}

						//compare old grid to new grid. When difference is detected, and is a new piece, that is the move
							if(oldGrid != null) {
									if(oldGrid != res) {
										for(var i = 0; i < 64; i++) {
											if(oldGrid[i] != res[i] && res[i] != 0) {
												if(res[i] == 1) {
													piece = "WP";
												} else if(res[i] == 2) {
													piece = "WK";
												} else if(res[i] == 3) {
													piece = "WB";
												} else if(res[i] == 4) {
													piece = "WC";
												} else if(res[i] == 5) {
													piece = "WQ";
												}else if(res[i] == 6) {
													piece = "WK";
												} else if(res[i] == 7) {
													piece = "BP";
												} else if(res[i] == 8) {
													piece = "BK";
												} else if(res[i] == 9) {
													piece = "BB";
												} else if(res[i] == "A") {
													piece = "BC";
												} else if(res[i] == "B") {
													piece = "BQ";
												}else if(res[i] == "C") {
													piece = "BK";
												}

												var row = int((i+8)/8); //from 1 to 8
												var col = (i+9)%8;
												if(col == 0)
													col = 8;//from 1 to 8
												//use selection to determine what the piece was and what square it moved to
												if(col == 1) {
													col = "A";
												} else if(col == 2) {
													col = "B";
												} else if(col == 3) {
													col = "C";
												} else if(col == 4) {
													col = "D";
												} else if(col == 5) {
													col = "E";
												} else if(col == 6) {
													col = "F";
												} else if(col == 7) {
													col = "G";
												} else if(col == 8) {
													col = "H";
												}

												hist = piece + " to " + col + row;
												//document.getElementById('mh').innerText = document.getElementById('mh').innerText + col + row;
											}
										}
									}
								}

						oldGrid = res;

						document.getElementById('w_s').innerText = "White Standing: " + ws;
						document.getElementById('b_s').innerText = "Black Standing: " + bs;

						var linebreak = document.createElement("br");
						if(hist != "" && ohist != hist) {
							document.getElementById('mh').appendChild(linebreak);
							document.getElementById('mh').innerText = document.getElementById('mh').innerText + hist;
							ohist = hist;
						}
					});
		mill = millis();
	}
}
