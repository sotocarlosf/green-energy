#include "DHT.h"
#include "MQ135.h"

#define DHTTYPE DHT11   // DHT 11
#include <Wire.h>

//CONFIG MQ135
// Calibration resistance at atmospheric CO2 level
#define RZERO 2933 
MQ135 gasSensor1 = MQ135(A2); 
MQ135 gasSensor2 = MQ135(A3); 
float c1, c2, zero1, zero2;

//CONFIG DHT11
//DHT dht1(A0, DHTTYPE);
//DHT dht2(A1, DHTTYPE);

#define relay1 6
#define relay2 7
#define relay3 8
#define relay4 9
#define relay5 10
#define relay6 11
#define relay7 12
#define relay8 13

//SERIAL
String inputString = "";         // a String to hold incoming data
boolean stringComplete = false;  // whether the string is complete
String outputString = "";

//I2C
char t[10];
int n = 0;

//DEF SENSORS VALUES
float dht1_temp, dht1_hum; 
float dht2_temp, dht2_hum; 
float c, zero, ppm1, ppm2;
float s0, s1, s2, s3, s6, s7;

// DEF RELAYS STATES
String relay1on = "relay1on", relay1off = "relay1off";
String relay2on = "relay2on", relay2off = "relay2off";
String relay3on = "relay3on", relay3off = "relay3off";
String relay4on = "relay4on", relay4off = "relay4off";
String relay5on = "relay5on", relay5off = "relay5off";
String relay6on = "relay6on", relay6off = "relay6off";
String relay7on = "relay7on", relay7off = "relay7off";
String relay8on = "relay8on", relay8off = "relay8off";

void setup() {
  // initialize serial:
  Serial.begin(9600);
  Serial.println("Esclavo: iniciando...");
  // initialize i2c
  Wire.begin(8);                // join i2c bus with address #8
  Wire.onRequest(requestEvent); // register event
  Wire.onReceive(receiveEvent);
  // reserve 200 bytes for the inputString:
  inputString.reserve(200);
//
//  dht1.begin();
//  dht2.begin();
  
  pinMode(relay1, OUTPUT);
  pinMode(relay2, OUTPUT);
  pinMode(relay3, OUTPUT);
  pinMode(relay4, OUTPUT);
  pinMode(relay5, OUTPUT);
  pinMode(relay6, OUTPUT);
  pinMode(relay7, OUTPUT);
  pinMode(relay8, OUTPUT);

  Serial.println("Esclavo: listo");
  measure();
}

void loop() {
  // print the string when a newline arrives:
  if (stringComplete) {
    //actuator();
  }
  measure();
}

void serialEvent() {
  while (Serial.available()) {
    inputString = String(Serial.readStringUntil('\n'));
    inputString.trim();
    stringComplete = false;
  }
}

void receiveEvent(){
  while(Wire.available()){
    n = Wire.read();
  }
  Serial.print(n);
}

void requestEvent()
{
 switch(n){
  case 0: //S0 - A0
    dtostrf(s0,4,2,t);
    Wire.write(t,10); 
    n = 1;
    break;
  case 1: //S1 - A1 
    dtostrf(s1,4,2,t);
    Wire.write(t,10);
    n = 2;  
    break;
  case 2: //S2 - A2
    dtostrf(s2,4,2,t);
    Wire.write(t,10);
    n = 3;  
    break;
  case 3: //S3 - A3
    dtostrf(s3,4,2,t);
    Wire.write(t,10);
    n = 4;  
    break;
  case 4: //S6 - A6
    dtostrf(s6,4,2,t);
    Wire.write(t,10);
    n = 5;  
    break;
  case 5: //S7 - A7
    dtostrf(s7,4,2,t);
    Wire.write(t,10);
    n = 6;  
    break;
  case 6: //S6 - A6 OPTIONAL
    dtostrf(s6,4,2,t);
    Wire.write(t,10);
    n = 7;  
    break;
  case 7: //S7 - A7 OPTIONAL
    dtostrf(s7,4,2,t);
    Wire.write(t,10);
    n = 0;  
    break;
 
  
  case 8: // R1ON
    Serial.println("relay1on");
    digitalWrite(relay1,HIGH);
    n = 0;  
    break;
  case 9: //R1OFF
    Serial.println("relay1off");
    digitalWrite(relay1,LOW);
    n = 0;  
    break;
  case 10: // R2ON
    Serial.println("relay2on");
    digitalWrite(relay2,HIGH);
    n = 0;  
    break;
  case 11: // R2OFF
    Serial.println("relay2off");
    digitalWrite(relay2,LOW);
    n = 0;  
    break;
  case 12: // R3ON
    Serial.println("relay3on");
    digitalWrite(relay3,HIGH);
    n = 0;  
    break;
  case 13: //R3OFF
    Serial.println("relay3off");
    digitalWrite(relay3,LOW);
    n = 0;  
    break;
  case 14: // R4ON
    Serial.println("relay4on");
    digitalWrite(relay4,HIGH);
    n = 0;  
    break;
  case 15: // R4OFF
    Serial.println("relay4off");
    digitalWrite(relay4,LOW);
    n = 0;  
    break;
  case 16: // R5ON
    Serial.println("relay5on");
    digitalWrite(relay5,HIGH);
    n = 0;  
    break;
  case 17: //R5OFF
    Serial.println("relay5off");
    digitalWrite(relay5,LOW);
    n = 0;  
    break;
  case 18: // R6ON
    Serial.println("relay6on");
    digitalWrite(relay6,HIGH);
    n = 0;  
    break;
  case 19: // R6OFF
    Serial.println("relay6off");
    digitalWrite(relay6,LOW);
    n = 0;  
    break;
  case 20: // R7ON
    Serial.println("relay7on");
    digitalWrite(relay7,HIGH);
    n = 0;  
    break;
  case 21: //R7OFF
    Serial.println("relay7off");
    digitalWrite(relay7,LOW);
    n = 0;  
    break;
  case 22: // R8ON
    Serial.println("relay8on");
    digitalWrite(relay8,HIGH);
    n = 0;  
    break;
  case 23: // R4OFF
    Serial.println("relay8off");
    digitalWrite(relay8,LOW);
    n = 0;  
    break;
 }
}

void measure(){
  //Serial.println("Reading sensors...");
//  s0 = analogRead(A0);
//  s1 = analogRead(A1);
//  s2 = analogRead(A2);
//  s3 = analogRead(A3);
//  s6 = analogRead(A6);
//  s7 = analogRead(A7);
  s0 = 1;
  s1 = 2;
//  s2 = 3;
//  s3 = 4;
  s6 = 5;
  s7 = 6;

  delay(5000);
  //c1 = analogRead(A2);
  //zero1 = gasSensor1.getCorrectedRZero(20.0, 17.0); 
  s2 = gasSensor1.getCorrectedPPM(20.0, 17, RZERO);
//  Serial.println();
//  Serial.print("MQ-135 1 DATA-> RAW: ");
//  Serial.print(c1);
//  Serial.print(", ZERO: ");
//  Serial.print(zero1);
//  Serial.print(", PPM: ");
//  Serial.println(s2);
  delay(4000);

  //c2 = analogRead(A3);
  zero2 = gasSensor2.getCorrectedRZero(20.0, 17.0); 
  s3 = gasSensor2.getCorrectedPPM(20, 17, zero2);
//  Serial.println();
//  Serial.print("MQ-135 2 DATA-> RAW: ");
//  Serial.print(c2);
//  Serial.print(", ZERO: ");
//  Serial.print(zero2);
//  Serial.print(", PPM: ");
//  Serial.println(s3);
  delay(4000);

}



