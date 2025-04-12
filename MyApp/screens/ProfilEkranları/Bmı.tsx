import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import BackButton from './Back';

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState('');

  const calculateBMI = () => {
    if (weight && height) {
      const heightInMeters = Number(height) / 100;
      const bmi = Number(weight) / (heightInMeters * heightInMeters);
      setBmiResult(Number(bmi.toFixed(1)));

      if (bmi < 18.5) setBmiCategory('Zayıf');
      else if (bmi < 24.9) setBmiCategory('Normal');
      else if (bmi < 29.9) setBmiCategory('Fazla Kilolu');
      else setBmiCategory('Obez');
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>BMI Hesaplama</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Kilonuz (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          placeholderTextColor="#666"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Boyunuz (cm)"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
          placeholderTextColor="#666"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Hesapla</Text>
      </TouchableOpacity>

      {bmiResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            BMI Değeriniz: {bmiResult}
          </Text>
          <Text style={styles.categoryText}>
            Kategori: {bmiCategory}
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
    marginBottom: 10,
  },
  categoryText: {
    color: '#0096c7',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default BMICalculator;