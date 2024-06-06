#include <Wire.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"

// FOR DHT11 SENSORS
#define DHTTYPE DHT22   // DHT 11
const int DHTPin1 = 14; // D5
const int DHTPin2 = 12; // D6
DHT dht1(DHTPin1, DHTTYPE);
DHT dht2(DHTPin2, DHTTYPE);
float h1, t1, h2, t2;

// FLASHING LED
const int interruptPin = 0; //GPIO 0 (Flash Button) 
const int LED=2; //On board blue LED 

// FOR SERIAL
String inputString = "";         // a String to hold incoming data
boolean stringComplete = false;  // whether the string is complete
int n = 0;

// FOR I2C
char str[10] = {}; // empty array for parking bytes received from slave
double t[10] = {};

// ACTUATORS
String relay;
int L1 = 1, V1 = 2, WL1 = 3, R1 = 4, L2 = 5, V2 = 6, WL2 = 7, R2 = 8;

// SENSORS (OTHERS THAN DHT11s)
float co21, co22;

//CONFIG WIFI
// Change the credentials below, so your ESP8266 connects to your router
const char* ssid = "elcompa";
const char* password = "elcompa13";

//CONFIG MQTT
// Change the variable to your Raspberry Pi IP address, so it connects to your MQTT broker
const char* mqtt_server = "10.0.0.13";

const int tiempoMuestreo = 5000; // ms

// Initializes the espClient. You should change the espClient name if you have multiple ESPs running in your home automation system
WiFiClient espClient;
PubSubClient client(espClient);

// Timers auxiliar variables
long now = millis();
long lastMeasure = 0;

// Don't change the function below. This functions connects your ESP8266 to your router
void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("WiFi connected - ESP IP address: ");
  Serial.println(WiFi.localIP());
}

// This functions is executed when some device publishes a message to a topic that your ESP8266 is subscribed to
// Change the function below to add logic to your program, so when a device publishes a message to a topic that 
// your ESP8266 is subscribed you can actually do something
void callback(String topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;
  
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();

  // Feel free to add more if statements to control more GPIOs with MQTT

  // If a message is received on the topic anaquel/leds/fl, you check if the message is either on or off. Turns the FL GPIO according to the message
  if(topic=="anaquel/fs/led"){
      Serial.print("Changing anaquel FL to ");
      if(messageTemp == "on"){
        actuator(L1,true);
        Serial.print("On");
      }
      else if(messageTemp == "off"){
        actuator(L1,false);
        Serial.print("Off");
      }
  }
  if(topic=="anaquel/fs/vent"){
      Serial.print("Changing anaquel FVent to ");
      if(messageTemp == "on"){
        actuator(V1,true);
        Serial.print("On");
      }
      else if(messageTemp == "off"){
        actuator(V1,false);
        Serial.print("Off");
      }
  }
  if(topic=="anaquel/fs/warmlight"){
      Serial.print("Changing anaquel FWarmLight to ");
      if(messageTemp == "on"){
        actuator(WL1,true);
        Serial.print("On");
      }
      else if(messageTemp == "off"){
        actuator(WL1,false);
        Serial.print("Off");
      }
  }
  if(topic=="casa/aero/riego"){
      Serial.print("Changing casa Riego to ");
      if(messageTemp == "on"){
        actuator(R1,true);
        Serial.print("On");
      }
      else if(messageTemp == "off"){
        actuator(R1,false);
        Serial.print("Off");
      }
  }
  if(topic=="anaquel/rs/led"){
      Serial.print("Changing anaquel RL to ");
      if(messageTemp == "on"){
        actuator(L2,true);
        Serial.print("On");
      }
      else if(messageTemp == "off"){
        actuator(L2,false);
        Serial.print("Off");
      }
  }
  if(topic=="anaquel/rs/vent"){
      Serial.print("Changing anaquel RVent to ");
      if(messageTemp == "on"){
        actuator(V2,true);
        Serial.print("On");
      }
      else if(messageTemp == "off"){
        actuator(V2,false);
        Serial.print("Off");
      }
  }
  if(topic=="anaquel/rs/warmlight"){
      Serial.print("Changing anaquel RWarmLight to ");
      if(messageTemp == "on"){
        actuator(WL2,true);
        Serial.print("On");
      }
      else if(messageTemp == "off"){
        actuator(WL2,false);
        Serial.print("Off");
      }
  }
  if(topic=="anaquel/rs/riego"){
      Serial.print("Changing anaquel RRiego to ");
      if(messageTemp == "on"){
        actuator(R2,true);
        Serial.print("On");
      }
      else if(messageTemp == "off"){
        actuator(R2,false);
        Serial.print("Off");
      }
  }
  Serial.println();
}

// This functions reconnects your ESP8266 to your MQTT broker
// Change the function below if you want to subscribe to more topics with your ESP8266 
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    /*
     YOU MIGHT NEED TO CHANGE THIS LINE, IF YOU'RE HAVING PROBLEMS WITH MQTT MULTIPLE CONNECTIONS
     To change the ESP device ID, you will have to give a new name to the ESP8266.
     Here's how it looks:
       if (client.connect("ESP8266Client")) {
     You can do it like this:
       if (client.connect("ESP1_Office")) {
     Then, for the other ESP:
       if (client.connect("ESP2_Garage")) {
      That should solve your MQTT multiple connections problem
    */
    if (client.connect("ESP8266Client")) {
      Serial.println("connected");  
      // Subscribe or resubscribe to a topic
      // You can subscribe to more topics (to control more LEDs in this example)
      client.subscribe("anaquel/fs/led");
      client.subscribe("anaquel/fs/vent");
      client.subscribe("anaquel/fs/warmlight");
      client.subscribe("casa/aero/riego");
      client.subscribe("anaquel/rs/led");
      client.subscribe("anaquel/rs/vent");
      client.subscribe("anaquel/rs/warmlight");
      client.subscribe("anaquel/rs/riego");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

// The setup function sets your ESP GPIOs to Outputs, starts the serial communication at a baud rate of 115200
// Sets your mqtt broker and sets the callback function
// The callback function is what receives messages and actually controls the LEDs
void setup() {
  Serial.begin(9600); 
  Serial.println("Iniciando...");
  Wire.begin(D1, D2); /* join i2c bus with SDA=D1 and SCL=D2 of NodeMCU */ 
  
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  inputString.reserve(200);

  dht1.begin();
  dht2.begin();
  Serial.println("Midiendo");
}

// For this project, you don't need to change anything in the loop function. Basically it ensures that you ESP is connected to your broker
void loop() {

  if (!client.connected()) {
    reconnect();
  }
  if(!client.loop())
    client.connect("ESP8266Client");
  
  now = millis();
  readDHT();
  
  if (now - lastMeasure > tiempoMuestreo) {
    lastMeasure = now;
    measure();
    //FS MEASURE
    static char temperatureTemp1[7];
    dtostrf(t1, 6, 2, temperatureTemp1);
    
    static char humidityTemp1[7];
    dtostrf(h1, 6, 2, humidityTemp1);

    static char co2s1[7];
    dtostrf(co21, 6, 2, co2s1);

    //RS MEASURE
    static char temperatureTemp2[7];
    dtostrf(t2, 6, 2, temperatureTemp2);
    
    static char humidityTemp2[7];
    dtostrf(h2, 6, 2, humidityTemp2);

    static char co2s2[7];
    dtostrf(co22, 6, 2, co2s2);
    
    // Publishes Temperature and Humidity values
    client.publish("casa/aero/temperature", temperatureTemp1);
    client.publish("casa/aero/humidity", humidityTemp1);
    client.publish("casa/aero/co2", co2s1);

    client.publish("anaquel/rs/temperature", temperatureTemp2);
    client.publish("anaquel/rs/humidity", humidityTemp2);
    client.publish("anaquel/rs/co2", co2s2);
    
    Serial.println ("Published");
    
    // Serial.print(hif);
    // Serial.println(" *F");
  }
} 

void actuator(int i, boolean state){
  Serial.println(i);
  relay+=i;
  if(state){
    relay+="on";
    Serial.println(relay);
    Wire.beginTransmission(8);
    Wire.write((i-1)*2+8);
    Wire.endTransmission(); 
  }
  else{
    relay+="off";
    Serial.println(relay);
    Wire.beginTransmission(8);
    Wire.write((i-1)*2+9);
    Wire.endTransmission(); 
  }
  Wire.requestFrom(8,10);
  relay = "relay";
}

void readSerial(){
  // print the string when a newline arrives:
  if (stringComplete) {
    Serial.println(inputString);
    // clear the string:
    inputString = "";
    stringComplete = false;
  }
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag so the main loop can
    // do something about it:
    if (inChar == '\n') {
      inputString.trim();
      stringComplete = true;
    }
  }
}

void readDHT(){
  h1 = dht1.readHumidity();
  // Read temperature as Celsius (the default)
  t1 = dht1.readTemperature();
  // Check if any reads failed and exit early (to try again). - DHT Sensor
  
  h2 = dht2.readHumidity();
  // Read temperature as Celsius (the default)
  t2 = dht2.readTemperature();
//  if (isnan(h2) || isnan(t2)) {
//    Serial.println("Failed to read from DHT sensor 2 !");
//    return;
//  }
//  else{
//  Serial.println(h2);
//  Serial.println(t2);  
//  }
}

void printMeasures(){
  Serial.print("S0: ");
  Serial.println(t[0]);  
  Serial.print("S1: ");
  Serial.println(t[1]);  
  Serial.print ("CO2 Concentration 1: "); 
  Serial.print (t[2]); 
  Serial.println("ppm");
  Serial.print ("CO2 Concentration 2: "); 
  Serial.print (t[3]);
  Serial.println("ppm"); 
  Serial.print("S6: ");
  Serial.println(t[4]); 
  Serial.print("S7: "); 
  Serial.println(t[5]); 
  if (isnan(h1) || isnan(t1)) {
    Serial.println("Failed to read from DHT sensor 1 !");
  }
  else{
    Serial.print("DHT11 sensor 1: Humidity: ");
    Serial.print(h1);
    Serial.print(" %\t; ");
    Serial.print("Temperature: ");
    Serial.print(t1);
    Serial.println(" *C ");
  }
  if (isnan(h2) || isnan(t2)) {
    Serial.println("Failed to read from DHT sensor 2 !");
  }
  else{
    Serial.print("DHT11 sensor 2: Humidity: ");
    Serial.print(h2);
    Serial.print(" %\t; ");
    Serial.print("Temperature: ");
    Serial.print(t2);
    Serial.println(" *C ");
  }
}

void measure(){
  Wire.beginTransmission(8);
  Wire.write(0);
  Wire.endTransmission();
  // EL ARREGLO NO TOMA EN CUENTAA EL 4 Y 5
  for(int i = 0; i < 6; i++){
    Wire.requestFrom(8, 10); // request 10 bytes from slave device #8
    for(int j = 0; j < 10; j++){
      str[j] = Wire.read(); // arriving characters parked in array t
    }

    t[i] = atof(str);
  }
  co21 = t[2];
  co22 = t[3];

  printMeasures();
}

