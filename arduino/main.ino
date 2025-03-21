#include <ArduinoJson.h>
#include <ArduinoJson.hpp>
/* 
  Sketch generated by the Arduino IoT Cloud Thing "Untitled"
  https://create.arduino.cc/cloud/things/6b6761e6-b732-4600-a4f7-9fbe87b404be 

  Arduino IoT Cloud Variables description

  The following variables are automatically generated and updated when changes are made to the Thing

  String ctg_hora;
  int ctg;

  Variables which are marked as READ/WRITE in the Cloud Thing will also have functions
  which are called when their values are changed from the Dashboard.
  These functions are generated with the Thing and added at the end of this sketch.
*/

#include <ArduinoJson.h>
#include "arduino_secrets.h"
#include "thingProperties.h"

// MQTT
#include <Ethernet.h>
#include <PubSubClient.h>

#define SENSOR_INPUT A0   // Entrada do sensor capacitivo (I1)
#define RESET_INPUT A7    // Entrada para resetar o contador (I8)
#define LED_GREEN_OUT 0   // Saída 1 (LED verde no relé)
#define LED_YELLOW_OUT 1  // Saída 2 (LED amarelo)
#define LED_RED_OUT 2     // Saída 3 (LED vermelho)

// Variáveis globais
int pageCount = 0;
int lastSensorState = HIGH;
unsigned long lastDetectionTime = 0;
unsigned long startHourTime = 0;
int pagesLastHour = 0;
bool esteiraParada = false;
const char* idEsteira = "rj4i903m";  // Após cadastrar a esteira, inserir o ID nessa variável

// Configurações de rede
byte mac[] = { 0xA8, 0x61, 0x0A, 0x50, 0x1A, 0xC1 };  // Endereço MAC do Finder Opta
IPAddress mqttServer(5, 196, 78, 28);  // IP do broker test.mosquitto.org
const int mqttPort = 1883;

EthernetClient ethClient;
PubSubClient client(ethClient);

void connectMQTT() {
  int attempts = 0;
  while (!client.connected() && attempts < 5) {
    Serial.print("Conectando ao broker MQTT...");
    if (client.connect("FinderOptaClientBartira2025")) {
      Serial.println("Conectado!");
    } else {
      Serial.print("Falha: ");
      Serial.println(client.state());
      delay(2000);
    }
    attempts++;
  }
}

void setup() {
  Serial.begin(9600);
  delay(1500);

  initProperties();
  ArduinoCloud.begin(ArduinoIoTPreferredConnection);
  setDebugMessageLevel(2);
  ArduinoCloud.printDebugInfo();

  pinMode(SENSOR_INPUT, INPUT);
  pinMode(RESET_INPUT, INPUT);
  pinMode(LED_GREEN_OUT, OUTPUT);
  pinMode(LED_YELLOW_OUT, OUTPUT);
  pinMode(LED_RED_OUT, OUTPUT);

  digitalWrite(LED_GREEN_OUT, HIGH);
  digitalWrite(LED_YELLOW_OUT, LOW);
  digitalWrite(LED_RED_OUT, LOW);
  
  startHourTime = millis();

  // Configura conexão Ethernet e MQTT
  Ethernet.begin(mac);
  client.setServer(mqttServer, mqttPort);
}

void loop() {
  ArduinoCloud.update();

  if (!client.connected()) {
    connectMQTT();  // Reconecta ao broker MQTT, se necessário
  }
  client.loop();

  int sensorState = digitalRead(SENSOR_INPUT);
  int resetState = digitalRead(RESET_INPUT);
  unsigned long currentTime = millis();

  if (resetState == HIGH) {
    pageCount = 0;
    pagesLastHour = 0;
    Serial.println("Contador resetado!");
  }

  if (lastSensorState == HIGH && sensorState == LOW) {
    pageCount++;
    Serial.print("Contagem de páginas: ");
    Serial.println(pageCount);
    lastDetectionTime = currentTime;
    ctg = pageCount;

    // Publica a contagem no tópico MQTT
    StaticJsonDocument<200> jsonDocContagem;
    jsonDocContagem["timestamp"] = millis();
    jsonDocContagem["contagem"] = pageCount;
    jsonDocContagem["id_esteira"] = idEsteira;
  
    char buffer[256];
    serializeJson(jsonDocContagem, buffer);

    client.publish("esteira/contagem", buffer);
  }

  lastSensorState = sensorState;

  unsigned long elapsedTime = (currentTime - startHourTime) / 1000; // Tempo em segundos
  
  if (elapsedTime >= 3600) { // 1 hora passou
    pagesLastHour = pageCount;

    // Publica o total de folhas lidas por hora no tópico MQTT
    StaticJsonDocument<200> jsonDocFolhasHora;
    jsonDocFolhasHora["timestamp"] = millis();
    jsonDocFolhasHora["folhas-hora"] = pagesLastHour;
    jsonDocFolhasHora["id_esteira"] = idEsteira;
  
    char bufferFolhasHora[256];
    serializeJson(jsonDocFolhasHora, bufferFolhasHora);

    client.publish("esteira/contagem-folhas-hora", bufferFolhasHora);

    // Publica o tempo de funcionamento no tópico MQTT
    StaticJsonDocument<200> jsonDocTempoFuncionamento;
    jsonDocTempoFuncionamento["timestamp"] = millis();
    jsonDocTempoFuncionamento["tempo_funcionando"] = elapsedTime;
    jsonDocTempoFuncionamento["id_esteira"] = idEsteira;
  
    char bufferTempoFuncionamento[256];
    serializeJson(jsonDocTempoFuncionamento, bufferTempoFuncionamento);

    client.publish("esteira/tempo-funcionamento", bufferTempoFuncionamento);

    Serial.print("Folhas na última hora: ");
    Serial.println(pagesLastHour);

    startHourTime = millis(); // Reinicia o tempo
    pageCount = 0; // Reseta a contagem para nova hora
  }

  unsigned long timeWithoutDetection = (currentTime - lastDetectionTime) / 1000;

  bool yellowOn = timeWithoutDetection > 1200 && timeWithoutDetection <= 2400;
  bool redOn = timeWithoutDetection > 2400;

  if (redOn && !esteiraParada) {
    esteiraParada = true;

    digitalWrite(LED_YELLOW_OUT, LOW);
    digitalWrite(LED_GREEN_OUT, LOW);
    digitalWrite(LED_RED_OUT, HIGH);

    // Criar JSON para MQTT
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["timestamp"] = millis();
    jsonDoc["semDeteccao"] = true;
    jsonDoc["id_esteira"] = idEsteira;

    char buffer[256];
    serializeJson(jsonDoc, buffer);

    client.publish("esteiraA/deteccao", buffer);
    Serial.println("Publicação MQTT (Esteira Parada): " + String(buffer));
  } 
  else if (!redOn) {
    if (yellowOn && !esteiraParada) {
      esteiraParada = true;

      digitalWrite(LED_YELLOW_OUT, HIGH);
      digitalWrite(LED_GREEN_OUT, LOW);
      digitalWrite(LED_RED_OUT, LOW);

      // Criar JSON para MQTT
      StaticJsonDocument<200> jsonDoc;
      jsonDoc["timestamp"] = millis();
      jsonDoc["semDeteccao"] = true;
      jsonDoc["id_esteira"] = idEsteira;

      char buffer[256];
      serializeJson(jsonDoc, buffer);

      client.publish("esteiraA/deteccao", buffer);
      Serial.println("Publicação MQTT (Esteira Parada): " + String(buffer));
    } else if (!yellowOn && esteiraParada) {
      esteiraParada = false;
      digitalWrite(LED_YELLOW_OUT, LOW);
      digitalWrite(LED_GREEN_OUT, HIGH);
      digitalWrite(LED_RED_OUT, LOW);
      
      // Criar JSON para MQTT
      StaticJsonDocument<200> jsonDoc;
      jsonDoc["timestamp"] = millis();
      jsonDoc["semDeteccao"] = false;
      jsonDoc["id_esteira"] = idEsteira;

      char buffer[256];
      serializeJson(jsonDoc, buffer);
      
      client.publish("esteiraA/deteccao", buffer);
      Serial.println("Publicação MQTT (Esteira em movimento): " + String(buffer));
    }
  }

  delay(100);
}
