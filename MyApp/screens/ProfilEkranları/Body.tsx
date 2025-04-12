import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from './Back';

const STORAGE_KEYS = {
  chest: '@body_chest',
  shoulders: '@body_shoulders',
  biceps: '@body_biceps',
  forearm: '@body_forearm',
  waist: '@body_waist',
  hip: '@body_hip',
  thigh: '@body_thigh',
  calf: '@body_calf',
} as const;

type BodyPart = keyof typeof STORAGE_KEYS;

type Measurements = {
  [K in BodyPart]: string;
};

const Body = () => {
  const [measurements, setMeasurements] = useState<Measurements>({
    chest: '',
    shoulders: '',
    biceps: '',
    forearm: '',
    waist: '',
    hip: '',
    thigh: '',
    calf: '',
  });

  useEffect(() => {
    loadMeasurements();
  }, []);

  const loadMeasurements = async () => {
    try {
      const loaded: Partial<Measurements> = {};
      for (const key of Object.keys(STORAGE_KEYS) as BodyPart[]) {
        const value = await AsyncStorage.getItem(STORAGE_KEYS[key]);
        loaded[key] = value || '';
      }
      setMeasurements((prev) => ({ ...prev, ...loaded }));
    } catch (e) {
      console.error('Veriler yüklenirken hata:', e);
    }
  };

  const saveMeasurements = async () => {
    try {
      for (const key of Object.keys(STORAGE_KEYS) as BodyPart[]) {
        await AsyncStorage.setItem(STORAGE_KEYS[key], measurements[key]);
      }
      Alert.alert('Başarılı', 'Ölçüler kaydedildi!');
    } catch (e) {
      console.error('Veriler kaydedilirken hata:', e);
      Alert.alert('Hata', 'Kaydetme sırasında bir sorun oluştu.');
    }
  };

  const handleChange = (key: BodyPart, value: string) => {
    setMeasurements((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getLabel = (key: BodyPart) => {
    const labels: Record<BodyPart, string> = {
      chest: 'Göğüs',
      shoulders: 'Omuz',
      biceps: 'Kol (Biceps)',
      forearm: 'Ön Kol',
      waist: 'Bel',
      hip: 'Kalça',
      thigh: 'Uyluk',
      calf: 'Baldır',
    };
    return labels[key];
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Vücut Ölçüleri</Text>
      <ScrollView contentContainerStyle={styles.scroll}>
        {(Object.keys(STORAGE_KEYS) as BodyPart[]).map((key) => (
          <View key={key} style={styles.inputGroup}>
            <Text style={styles.label}>{getLabel(key)}</Text>
            <TextInput
              style={styles.input}
              value={measurements[key]}
              onChangeText={(text) => handleChange(key, text)}
              keyboardType="numeric"
              placeholder="cm"
              placeholderTextColor="#888"
            />
          </View>
        ))}

        <TouchableOpacity style={styles.saveButton} onPress={saveMeasurements}>
          <Text style={styles.saveText}>Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  scroll: {
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#0096c7',
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  saveButton: {
    backgroundColor: '#0096c7',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Body;
