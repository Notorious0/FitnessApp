// screens/ProfilEkranları/Pr.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from './Back';

const Pr = () => {
  const [bench, setBench] = useState('');
  const [squat, setSquat] = useState('');
  const [deadlift, setDeadlift] = useState('');

  const STORAGE_KEYS = {
    bench: '@pr_bench',
    squat: '@pr_squat',
    deadlift: '@pr_deadlift',
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedBench = await AsyncStorage.getItem(STORAGE_KEYS.bench);
        const storedSquat = await AsyncStorage.getItem(STORAGE_KEYS.squat);
        const storedDeadlift = await AsyncStorage.getItem(STORAGE_KEYS.deadlift);

        if (storedBench) setBench(storedBench);
        if (storedSquat) setSquat(storedSquat);
        if (storedDeadlift) setDeadlift(storedDeadlift);
      } catch (error) {
        console.error('Veriler yüklenemedi:', error);
      }
    };

    loadData();
  }, []);

  // Değerleri kaydet
  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.bench, bench);
      await AsyncStorage.setItem(STORAGE_KEYS.squat, squat);
      await AsyncStorage.setItem(STORAGE_KEYS.deadlift, deadlift);
      Alert.alert('Başarılı', 'Değerler kaydedildi!');
    } catch (error) {
      console.error('Veriler kaydedilemedi:', error);
      Alert.alert('Hata', 'Veriler kaydedilemedi.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton />
      <Text style={styles.title}>Powerlifting PR'larım</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Bench Press (kg)"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={bench}
          onChangeText={setBench}
        />
        <TextInput
          style={styles.input}
          placeholder="Squat (kg)"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={squat}
          onChangeText={setSquat}
        />
        <TextInput
          style={styles.input}
          placeholder="Deadlift (kg)"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={deadlift}
          onChangeText={setDeadlift}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={saveData}>
        <Text style={styles.buttonText}>Kaydet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flexGrow: 1,
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
});

export default Pr;
