package ml

import (
	"math"
	"math/rand"
	"time"
)

type NeuralNetwork struct {
	inputNodes   int
	hiddenNodes  int
	outputNodes  int
	learningRate float64
	weightsIH    [][]float64 // wagi między warstwą wejściową a ukrytą
	weightsHO    [][]float64 // wagi między warstwą ukrytą a wyjściową
}

// Tworzenie nowej sieci neuronowej
func NewNeuralNetwork(input, hidden, output int, rate float64) *NeuralNetwork {
	nn := &NeuralNetwork{
		inputNodes:   input,
		hiddenNodes:  hidden,
		outputNodes:  output,
		learningRate: rate,
	}

	// Inicjalizacja losowych wag
	rand.Seed(time.Now().UnixNano())

	// Inicjalizacja wag między warstwą wejściową a ukrytą
	nn.weightsIH = make([][]float64, nn.hiddenNodes)
	for i := range nn.weightsIH {
		nn.weightsIH[i] = make([]float64, nn.inputNodes)
		for j := range nn.weightsIH[i] {
			nn.weightsIH[i][j] = rand.Float64()*2 - 1
		}
	}

	// Inicjalizacja wag między warstwą ukrytą a wyjściową
	nn.weightsHO = make([][]float64, nn.outputNodes)
	for i := range nn.weightsHO {
		nn.weightsHO[i] = make([]float64, nn.hiddenNodes)
		for j := range nn.weightsHO[i] {
			nn.weightsHO[i][j] = rand.Float64()*2 - 1
		}
	}

	return nn
}

// Funkcja aktywacji (sigmoid)
func sigmoid(x float64) float64 {
	return 1.0 / (1.0 + math.Exp(-x))
}

// Pochodna funkcji sigmoid
func sigmoidDerivative(x float64) float64 {
	return x * (1.0 - x)
}

// Przewidywanie wyniku
func (nn *NeuralNetwork) Predict(inputs []float64) []float64 {
	// Warstwa ukryta
	hidden := make([]float64, nn.hiddenNodes)
	for i := 0; i < nn.hiddenNodes; i++ {
		sum := 0.0
		for j := 0; j < nn.inputNodes; j++ {
			sum += inputs[j] * nn.weightsIH[i][j]
		}
		hidden[i] = sigmoid(sum)
	}

	// Warstwa wyjściowa
	outputs := make([]float64, nn.outputNodes)
	for i := 0; i < nn.outputNodes; i++ {
		sum := 0.0
		for j := 0; j < nn.hiddenNodes; j++ {
			sum += hidden[j] * nn.weightsHO[i][j]
		}
		outputs[i] = sigmoid(sum)
	}

	return outputs
}

// Trenowanie sieci
func (nn *NeuralNetwork) Train(inputs []float64, targets []float64) {
	// Forward pass
	// Warstwa ukryta
	hidden := make([]float64, nn.hiddenNodes)
	for i := 0; i < nn.hiddenNodes; i++ {
		sum := 0.0
		for j := 0; j < nn.inputNodes; j++ {
			sum += inputs[j] * nn.weightsIH[i][j]
		}
		hidden[i] = sigmoid(sum)
	}

	// Warstwa wyjściowa
	outputs := make([]float64, nn.outputNodes)
	for i := 0; i < nn.outputNodes; i++ {
		sum := 0.0
		for j := 0; j < nn.hiddenNodes; j++ {
			sum += hidden[j] * nn.weightsHO[i][j]
		}
		outputs[i] = sigmoid(sum)
	}

	// Backward pass
	// Obliczanie błędów warstwy wyjściowej
	outputErrors := make([]float64, nn.outputNodes)
	for i := 0; i < nn.outputNodes; i++ {
		outputErrors[i] = targets[i] - outputs[i]
	}

	// Aktualizacja wag między warstwą ukrytą a wyjściową
	for i := 0; i < nn.outputNodes; i++ {
		for j := 0; j < nn.hiddenNodes; j++ {
			delta := nn.learningRate * outputErrors[i] * sigmoidDerivative(outputs[i]) * hidden[j]
			nn.weightsHO[i][j] += delta
		}
	}

	// Obliczanie błędów warstwy ukrytej
	hiddenErrors := make([]float64, nn.hiddenNodes)
	for i := 0; i < nn.hiddenNodes; i++ {
		error := 0.0
		for j := 0; j < nn.outputNodes; j++ {
			error += outputErrors[j] * nn.weightsHO[j][i]
		}
		hiddenErrors[i] = error
	}

	// Aktualizacja wag między warstwą wejściową a ukrytą
	for i := 0; i < nn.hiddenNodes; i++ {
		for j := 0; j < nn.inputNodes; j++ {
			delta := nn.learningRate * hiddenErrors[i] * sigmoidDerivative(hidden[i]) * inputs[j]
			nn.weightsIH[i][j] += delta
		}
	}
}

// Struktura do przechowywania danych treningowych
type TrainingData struct {
	WorkoutTime      float64
	WorkoutIntensity float64
	PreviousMood     float64
	ExpectedMood     float64
}

// Funkcja do normalizacji danych
func normalize(value, min, max float64) float64 {
	return (value - min) / (max - min)
}

// Przykład użycia:
func ExampleUsage() {
	// Tworzenie sieci neuronowej (3 wejścia, 4 neurony ukryte, 1 wyjście)
	nn := NewNeuralNetwork(3, 4, 1, 0.1)

	// Przykładowe dane treningowe
	trainingData := []TrainingData{
		{WorkoutTime: 1.5, WorkoutIntensity: 0.8, PreviousMood: 7.0, ExpectedMood: 8.0},
		{WorkoutTime: 0.5, WorkoutIntensity: 0.3, PreviousMood: 5.0, ExpectedMood: 5.0},
		{WorkoutTime: 2.0, WorkoutIntensity: 0.9, PreviousMood: 6.0, ExpectedMood: 8.5},
		// Dodaj więcej danych treningowych...
	}

	// Trenowanie sieci
	for i := 0; i < 1000; i++ { // 1000 epok
		for _, data := range trainingData {
			inputs := []float64{
				normalize(data.WorkoutTime, 0, 3),   // zakładamy max 3h treningu
				data.WorkoutIntensity,               // już znormalizowane 0-1
				normalize(data.PreviousMood, 0, 10), // skala 0-10
			}

			targets := []float64{normalize(data.ExpectedMood, 0, 10)}

			nn.Train(inputs, targets)
		}
	}
}
func PredictMood(workoutTime, workoutIntensity, previousMood float64) float64 {
	// Tworzenie sieci neuronowej
	nn := NewNeuralNetwork(3, 4, 1, 0.1)

	// Normalizacja danych wejściowych
	inputs := []float64{
		workoutTime / 3.0,   // normalizacja czasu treningu (zakładamy max 3h)
		workoutIntensity,    // zakładamy, że jest już w skali 0-1
		previousMood / 10.0, // normalizacja nastroju (skala 0-10)
	}

	// Przewidywanie
	output := nn.Predict(inputs)

	// Denormalizacja wyniku
	return output[0] * 10.0 // przeskalowanie z powrotem do skali 0-10
}
