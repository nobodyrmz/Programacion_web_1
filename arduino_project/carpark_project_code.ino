#include <Servo.h> // Incluye la librería Servo para controlar el servomotor

int boton = 0; // Variable que registra el estado del botón (cantidad de pulsaciones)
Servo motor; // Crea un objeto Servo para controlar la barrera de entrada

// Código inicial que se ejecuta una sola vez
void setup() { 
   pinMode(7, OUTPUT); // Configura el pin 7 como salida para el LED amarillo (farol)
   pinMode(9, OUTPUT); // Configura el pin 9 como salida para el LED rojo (espacio de discapacitados)
   pinMode(4, INPUT);  // Configura el pin 4 como entrada para el botón de activación
   pinMode(A4, INPUT); // Configura el pin A4 como entrada para la fotoresistencia del área de discapacitados
   pinMode(A5, INPUT); // Configura el pin A5 como entrada para la fotoresistencia del farol
   Serial.begin(9600); // Inicializa la comunicación serial a 9600 baudios para monitorear datos
   pinMode(8, OUTPUT); // Configura el pin 8 como salida para el buzzer (emisor de sonido)
   pinMode(3, OUTPUT); // Configura el pin 3 como salida para el LED verde (estado de la barrera)
   pinMode(2, OUTPUT); // Configura el pin 2 como salida para el LED rojo (estado de la barrera)
   
   motor.attach(5, 500, 2500); // Asocia el servomotor al pin 5 y define sus límites de movimiento
   boton = 0; // Inicializa la variable del botón en 0
}

// Código en bucle
void loop() { 
   // Detección del botón (incrementa al presionar)
   if (digitalRead(4) == 1) { 
      boton += 1; // Incrementa el contador del botón
      delay(350); // Añade un pequeño retraso para evitar múltiples lecturas por un solo toque
   }

   Serial.println("1"); // Imprime "1" para monitorear en el monitor serial

   // Control de la barrera según el estado del botón
   if (boton == 1) { 
      motor.write(180); // Abre la barrera
      digitalWrite(3, HIGH); // Enciende el LED verde (indica acceso permitido)
      digitalWrite(2, LOW);  // Apaga el LED rojo
      digitalWrite(8, HIGH); // Activa el buzzer por un corto periodo
      delay(150); 
      digitalWrite(8, LOW);  // Apaga el buzzer
      delay(150);
   } else { 
      motor.write(90); // Cierra la barrera
      boton = 0; // Reinicia el contador del botón
      digitalWrite(3, LOW); // Apaga el LED verde
      digitalWrite(2, HIGH); // Enciende el LED rojo (indica acceso denegado)
      digitalWrite(8, LOW);  // Apaga el buzzer
   }

   // Lee y muestra los valores de las fotoresistencias
   Serial.println(analogRead(A4)); // Lee y muestra el valor analógico del pin A4 (espacio de discapacitados)
   Serial.println(analogRead(A5)); // Lee y muestra el valor analógico del pin A5 (farol)

   // Control del espacio de discapacitados según la luz detectada
   if (analogRead(A4) > 500) { 
      digitalWrite(9, HIGH); // Si detecta alta luz, enciende el LED rojo (indica que el espacio está ocupado)
   } else { 
      digitalWrite(9, LOW); // Si no detecta alta luz, apaga el LED rojo
   }

   // Control del farol según la luz ambiental
   if (analogRead(A5) < 200) { 
      digitalWrite(7, HIGH); // Si detecta baja luz, enciende el LED amarillo (activa el farol)
   } else { 
      digitalWrite(7, LOW); // Si detecta suficiente luz, apaga el LED amarillo
   }
}
