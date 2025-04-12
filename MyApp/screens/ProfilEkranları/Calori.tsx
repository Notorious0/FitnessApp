import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import BackButton from './Back';

const Calori = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculateCalories = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (isNaN(w) || isNaN(h) || isNaN(a)) {
      setResult(null);
      return;
    }

    // Mifflin-St Jeor Formülü (erkek için)
    const bmr = 10 * w + 6.25 * h - 5 * a + 5;
    const tdee = bmr * 1.55; // orta seviye aktivite için

    setResult(Math.round(tdee));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <BackButton />
        <Text style={styles.title}>Kalori İhtiyacı Hesaplama</Text>

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
          <TextInput
            style={styles.input}
            placeholder="Yaşınız"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
            placeholderTextColor="#666"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={calculateCalories}>
          <Text style={styles.buttonText}>Hesapla</Text>
        </TouchableOpacity>

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              Günlük ortalama kalori ihtiyacınız:
            </Text>
            <Text style={styles.kcalText}>{result} kcal</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
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
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  kcalText: {
    fontSize: 24,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default Calori;
