#if defined (PARTICLE)
#include "Adafruit_MCP23017.h"
#else
#include <Wire.h>
#include "Adafruit_MCP23017.h"
#endif

Adafruit_MCP23017 mcp;
Adafruit_MCP23017 mcp2;
Adafruit_MCP23017 mcp3;
Adafruit_MCP23017 mcp4;

String outputGrid = "";
String debug = "";

int board[8][8];
int sensorState[8][8];
int oldState[8][8];
int stack[32];
  
void setup() {  
    //define particle variables
    Particle.variable("outputGrid", &outputGrid, STRING);
    Particle.variable("debug", &debug, STRING);
    Particle.function("newGame", newGame);
    
    //initalize internal states
    mcp.begin(0);      // use default address 0
    mcp2.begin(1);
    mcp3.begin(2);
    mcp4.begin(3);
    pinMode(D5, INPUT_PULLUP);
    pinMode(D4, INPUT_PULLUP);
    pinMode(D6, INPUT_PULLUP);
    pinMode(A5, OUTPUT);
    

    for(int i = 0; i < 16; i++) { //all pins to input
        mcp.pinMode(i, INPUT);
        mcp.pullUp(i, HIGH);  // turn on a 100K pullup internally
        mcp2.pinMode(i, INPUT);
        mcp2.pullUp(i, HIGH);  // turn on a 100K pullup internally
        mcp3.pinMode(i, INPUT);
        mcp3.pullUp(i, HIGH);  // turn on a 100K pullup internally
        mcp4.pinMode(i, INPUT);
        mcp4.pullUp(i, HIGH);  // turn on a 100K pullup internally
    }
    
    checkSensors();
    setOld();
    initBoard();
    initStack();
}



void loop() {
  //update board & read
  checkSensors();
  updateBoard(); //enable when sensors active
  updateOutput();
  setOld();
}

void updateBoard() {
    for(int i = 0; i < 8; i++) {
        for(int j = 0; j < 8; j++) {
            if(board[i][j] != 0 && sensorState[i][j] == 1) {
                pushStack(board[i][j]);
                board[i][j] = 0;
                tone(A5, 500, 200);
            }
            if(oldState[i][j] != sensorState[i][j] && sensorState[i][j] == 0 && board[i][j] == 0) {
                board[i][j] = popStack();
                tone(A5, 1000, 200);
            }
        }
    }
}

void updateOutput() {
    outputGrid = "";
    debug = "";
    for(int i = 0; i < 8; i++) {
        for(int j = 0; j < 8; j++) {
            if(board[i][j] != 10 && board[i][j] != 11 && board[i][j] != 12) {
                outputGrid += board[i][j];
            } else if(board[i][j] == 10) {
                outputGrid += "A";
            } else if(board[i][j] == 11) {
                outputGrid += "B";
            } else if(board[i][j] == 12) {
                outputGrid += "C";
            }
            debug += sensorState[i][j];
        }
    }
}

void checkSensors() { //current code reads rows in, expecting each MCP to hold two rows of pieces such that row 1 is 0-7 and row two is 8-15
    for(int i = 0; i < 2; i++) {
        for(int j = 0; j < 8; j++) {
            int selected = (i)*8+(j);
            if(!(i == 1 && j == 2)) {
                sensorState[i][j] = mcp.digitalRead(selected);
            }
            sensorState[i+2][j] = mcp2.digitalRead(selected);
            sensorState[i+4][j] = mcp3.digitalRead(selected);
            sensorState[i+6][j] = mcp4.digitalRead(selected);
        }
    }
    sensorState[1][2] = digitalRead(D5);
    //sensorState[3][2] = digitalRead(D3);
    sensorState[5][2] = digitalRead(D4);
    sensorState[6][2] = digitalRead(D6);
}

void pushStack(int val) {
    for(int i = 0; i < 32; i++) {
        if(stack[i] == -1) {
            stack[i] = val;
            break;
        }
    }
}

int popStack() {
    for(int i = 31; i >= 0; i--) {
        if(stack[i] != -1) {
            int temp = stack[i];
            stack[i] = -1;
            return temp;
            break;
        }
    }
}

void initBoard() {
    for(int i = 0; i < 8; i++) {
        for(int j = 0; j < 8; j++) {
            board[i][j] = 0;
        }
    }
    //white side
    board[1][0] = 1;
    board[1][1] = 1;
    board[1][2] = 1;
    board[1][3] = 1;
    board[1][4] = 1;
    board[1][5] = 1;
    board[1][6] = 1;
    board[1][7] = 1;
    board[0][0] = 4;
    board[0][1] = 2;
    board[0][2] = 3;
    board[0][3] = 5;
    board[0][4] = 6;
    board[0][5] = 3;
    board[0][6] = 2;
    board[0][7] = 4;
    //black
    board[6][0] = 7;
    board[6][1] = 7;
    board[6][2] = 7;
    board[6][3] = 7;
    board[6][4] = 7;
    board[6][5] = 7;
    board[6][6] = 7;
    board[6][7] = 7;
    board[7][0] = 10;
    board[7][1] = 8;
    board[7][2] = 9;
    board[7][3] = 11;
    board[7][4] = 12;
    board[7][5] = 9;
    board[7][6] = 8;
    board[7][7] = 10;
}

void initStack() {
    for(int i = 0; i < 32; i++) {
        stack[i] = -1;
    }
}

void setOld() {
    for(int i = 0; i < 8; i++) {
        for (int j = 0; j < 8; j++) {
            oldState[i][j] = sensorState[i][j];
        }
    }
}

int newGame(String reee) {
    initBoard();
    return 0;
}
