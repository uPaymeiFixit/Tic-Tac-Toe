/**
 * Schematics: 5x5 LED matrix with anodes on pins 8-12 and cathodes on pins 3-7
 * This matrix size can be easily changed
 * The firmware receives two values at a time over serial COM with a baud rate of 9600
 * The first value is the x value and can be anywhere from 0 to 4
 * The second value is the y value and can be anywhere from 0 to 4
 * You can send 'c' to clear the matrix
 * The current limit is 24 values, this can be easily changed though
 *
 * @author Josh Gibbs
 */

int incomingByte;
int i, p;

//counts LEDs turned on
int t = -1;

//Stores LED coordinates
int arx[25];
int ary[25];

void setup() {
  Serial.begin(9600); // initialize serial communication
  for(int i = 3; i <= 12; i++){
    pinMode(i, OUTPUT);
  }
}

void loop() {
  if (Serial.available() > 0) { //Only adds coordinates while there is one in serial
    incomingByte = Serial.read(); //Reads coordinates
    //Clears board if c is received
    if(incomingByte == 'c'){
      digitalWrite(arx[t], LOW);
      t = -1;
      printDebug(0, 0);
    }
    else{
      //Lets the loop run twice then adds coordinates
      if(i == 0){
        t++;
        arx[t] = incomingByte - 40; //0 = 48 and the pin starts at 8 so we subtract 40
      }
      else{
        ary[t] = incomingByte - 45; //This pin starts at 3
        printDebug(1, t);
        i = -1;
      }
      i++;
    }
  }
  doLight();
}

void doLight(){
  //Lights upeach light one at a time
  for(int r = 0; r <= t; r++){
    //Sets all the ground pins HIGH
    for(int g = 3; g <= 7; g++){
      digitalWrite(g, HIGH);
      //printDebug(2, g);
    }
    //Sets all the live pins LOW
    for(int f = 8; f <= 12; f++){
      digitalWrite(f, LOW);
      //printDebug(3, f);
    }
    //Turns on only the right LEDs
    digitalWrite(arx[r], HIGH);
    //printDebug(4, r);
    digitalWrite(ary[r], LOW);
    //printDebug(5, r);
    
    delay(1);
  }
}

//Prints debug depending on where it is called from
void printDebug(int run, int v){
  if(run == 0){
    Serial.println("Clearing");
  }
  else if(run == 1){
    Serial.print("Received [");
    Serial.print(v);
    Serial.print("] = (");
    Serial.print(arx[v] - 8);
    Serial.print(", ");
    Serial.print(ary[v] - 3);
    Serial.println(")");
  }
  else if(run == 2){
    Serial.print("digitalWrite(");
    Serial.print(v);
    Serial.println(", HIGH);");
  }
  else if(run == 3){
    Serial.print("digitalWrite(");
    Serial.print(v);
    Serial.println(", LOW);");
  }
  else if(run == 4){
    Serial.print("digitalWrite(arx[");
    Serial.print(v);
    Serial.println(", HIGH);");
  }
  else if(run == 5){
    Serial.print("digitalWrite(ary[");
    Serial.print(v);
    Serial.println(", LOW);");
  }
}
