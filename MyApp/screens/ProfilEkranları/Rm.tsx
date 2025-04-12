import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import BackButton from './Back';

const RMCalculator = () => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rmResult, setRmResult] = useState<number | null>(null);

  const calculateRM = () => {
    if (weight && reps) {
      const rm = Number(weight) * (36 / (37 - Number(reps)));
      setRmResult(Number(rm.toFixed(1)));
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>1RM Hesaplama</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ağırlık (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          placeholderTextColor="#666"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Tekrar Sayısı"
          keyboardType="numeric"
          value={reps}
          onChangeText={setReps}
          placeholderTextColor="#666"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={calculateRM}>
        <Text style={styles.buttonText}>Hesapla</Text>
      </TouchableOpacity>

      {rmResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Tahmini 1RM: {rmResult} kg
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    width: '100%',
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0096c7',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  resultText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default RMCalculator;