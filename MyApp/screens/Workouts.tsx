import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigator/AppNavigator";
import { getExercisesByBodyPart } from "../src/exerciseService";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Exercise } from "./types";
import { capitalizeWords } from "./utils/capitalizeWords";

const { width } = Dimensions.get("window");

type WorkoutsScreenNavigationProp = StackNavigationProp<RootStackParamList, "Workouts">;
type WorkoutsScreenRouteProp = RouteProp<RootStackParamList, "Workouts">;

interface Props {
  navigation: WorkoutsScreenNavigationProp;
}

const Workouts: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<WorkoutsScreenRouteProp>();
  const { muscleGroup, existingExercises = [] } = route.params;

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const exerciseData = await getExercisesByBodyPart(muscleGroup);
        setExercises(exerciseData);
        setFilteredExercises(exerciseData);
      } catch (error) {
        console.error("Error loading exercises:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [muscleGroup]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = exercises.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredExercises(filtered);
  };

  const toggleExerciseSelection = (exercise: Exercise) => {
    setSelectedExercises((prevSelected) =>
      prevSelected.some((ex) => ex.id === exercise.id)
        ? prevSelected.filter((ex) => ex.id !== exercise.id)
        : [...prevSelected, exercise]
    );
  };

  const handleAddExercises = () => {
    const uniqueExercises = [...existingExercises];
    selectedExercises.forEach((exercise) => {
      if (!uniqueExercises.some((ex) => ex.id === exercise.id)) {
        uniqueExercises.push(exercise);
      }
    });
  
    // workoutName değerini koruyarak gönder
    navigation.navigate("WorkoutStep", { 
      selectedExercises: uniqueExercises,
      workoutName: route.params?.workoutName || "New Workout",
      isEdit: route.params?.isEdit || false,
      workoutId: route.params?.workoutId || null,
      supersets: route.params?.supersets || {},
      supersetColors: route.params?.supersetColors || {}, 
    });

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Egzersizler yükleniyor...</Text>
      </View>
    );
  }};

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-circle-outline" size={30} color="#0096c7" />
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            styles.headerTitle,
            {
              fontSize: muscleGroup.length < 15 ? 20 : muscleGroup.length < 30 ? 18 : 16,
            },
          ]}
        >
          {capitalizeWords(muscleGroup)} Egzersizleri
        </Text>
        <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)} style={styles.searchIcon}>
          <Ionicons name="search" size={24} color="#0096c7" />
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      {searchVisible && (
        <TextInput
          style={styles.searchInput}
          placeholder="Egzersiz ara..."
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      )}

      {/* EGZERSİZ LİSTESİ */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, selectedExercises.includes(item) && styles.selectedCard]}
            onPress={() => toggleExerciseSelection(item)}
          >
            <Image source={{ uri: item.gifUrl }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.exerciseName}>{capitalizeWords(item.name)}</Text>
            </View>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => navigation.navigate("WorkoutInfo", { exercise: item })}
            >
              <Ionicons name="information-circle-outline" size={40} color="#0096c7" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      {/* EKLE BUTONU */}
      {selectedExercises.length > 0 && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddExercises}>
          <Text style={styles.addButtonText}>
            {selectedExercises.length} {selectedExercises.length === 1 ? "Egzersiz Ekle" : "Egzersiz Ekle"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Workouts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#000",
    width: "100%",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 15,
    zIndex: 10,
  },
  searchIcon: {
    position: "absolute",
    right: 15,
    zIndex: 10,
  },
  headerTitle: {
    fontWeight: "bold",
    color: "#0096c7",
    textAlign: "center",
    flex: 1,
  },
  searchInput: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: "#0096c7",
  },
  loading: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 70,
    width: "100%",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 10,
    padding: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: width - 15,
  },
  selectedCard: {
    borderColor: "#0096c7",
    borderWidth: 2,
  },
  image: {
    width: 85,
    height: 85,
    borderRadius: 20,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  exerciseName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoButton: {
    padding: 8,
  },
  addButton: {
    backgroundColor: "#0096c7",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
