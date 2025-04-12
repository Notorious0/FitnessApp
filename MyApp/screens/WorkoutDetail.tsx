import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Image,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigator/AppNavigator";
import { deleteUserWorkout, fetchWorkoutById } from "../app/firestoreFunctions";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../app/AuthContext";
import { Workout, Exercise } from "./types";
import { FontAwesome5 } from "@expo/vector-icons";
import { capitalizeWords } from "./utils/capitalizeWords";


type WorkoutDetailRouteProp = RouteProp<RootStackParamList, "WorkoutDetail">;
type WorkoutDetailNavigationProp = StackNavigationProp<RootStackParamList,"WorkoutDetail">;



const WorkoutDetail = () => {
  const route = useRoute<WorkoutDetailRouteProp>();
  const navigation = useNavigation<WorkoutDetailNavigationProp>();
  const { user } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);

  const handleEditWorkout = () => {
    if (workout) {
      navigation.navigate("WorkoutStep", {
        selectedExercises: workout.exercises,
        workoutName: workout.workoutName,
        isEdit: true,
        workoutId: workout.id,
        supersets: workout.supersets,
        supersetColors: workout.supersetColors
      });
    }
  };

  useEffect(() => {
    const loadWorkout = async () => {
      if (user && route.params?.workoutId) {
        const fetchedWorkout = await fetchWorkoutById(
          user.uid,
          route.params.workoutId
        );
        setWorkout(fetchedWorkout as Workout | null);
      }
    };
    loadWorkout();
  }, [user, route.params?.workoutId]);

  const handleDeleteWorkout = async () => {
    if (!workout) return;
    Alert.alert(
      "Antrenmanı Sil",
      `${workout.workoutName} adlı antrenmanı silmek istediğinizden emin misiniz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            await deleteUserWorkout(workout.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {workout ? (
        <>
          {/* 🔄 Kompakt Üst Alan */}
          <View style={styles.headerBar}>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navButton}>
    <FontAwesome5 name="arrow-left" size={20} color="#0096c7" />
  </TouchableOpacity>

  <Text style={styles.navTitle}>
    {capitalizeWords(workout.workoutName)}
  </Text>

  <View style={styles.navIcons}>
    <TouchableOpacity onPress={handleEditWorkout} style={styles.iconBigButton}>
      <MaterialIcons name="edit" size={24} color="#0096c7" />
    </TouchableOpacity>
    <TouchableOpacity onPress={handleDeleteWorkout} style={styles.iconBigButton}>
      <MaterialIcons name="delete" size={24} color="#ff4d4d" />
    </TouchableOpacity>
  </View>
</View>

          {/* 📋 Egzersiz Listesi */}
          <FlatList
            data={workout.exercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const supersetColor = workout.supersetColors?.[item.id];

              return (
                <View style={styles.exerciseCard}>
                  <View style={styles.exerciseRow}>
                    {supersetColor && (
                      <View
                        style={[styles.supersetIndicator, { backgroundColor: supersetColor }]}
                      />
                    )}
                    <Image
                      source={{ uri: item.gifUrl || "https://via.placeholder.com/150" }}
                      style={styles.exerciseImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.exerciseName}>
                      {capitalizeWords(item.name)}
                    </Text>
                  </View>

                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderText}>SET</Text>
                    <Text style={styles.tableHeaderText}>KG</Text>
                    <Text style={styles.tableHeaderText}>TEKRAR</Text>
                  </View>

                  {item.sets?.map((set, index) => (
                    <View key={index} style={styles.setRow}>
                      <Text style={styles.setCell}>{index + 1}</Text>
                      <Text style={styles.setCell}>{set.kg}</Text>
                      <Text style={styles.setCell}>{set.repDisplay || set.reps}</Text>
                    </View>
                  ))}
                </View>
              );
            }}
          />
        </>
      ) : (
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      )}
    </View>
  );
};

export default WorkoutDetail;

// ✅ Stiller
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    padding: 16,
    paddingTop: 40,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#161616",
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  navButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(0,150,199,0.1)',
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  navIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBigButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },  
  iconSmallButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  exerciseCard: {
    backgroundColor: "#161616",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    marginLeft: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    position: 'relative',
  },
  supersetIndicator: {
    width: 4,
    height: '100%',
    position: 'absolute',
    left: -12,
    top: 0,
    borderRadius: 2,
  },
  exerciseImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: "#242424",
  },
  exerciseName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#242424",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  tableHeaderText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#242424",
  },
  setCell: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
  },
  loadingText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
    marginTop: 24,
  },
});