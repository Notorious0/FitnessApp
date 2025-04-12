import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigator/AppNavigator"; 
import { Exercise } from "../screens/types"; 
import { getExercisesByBodyPart } from "../src/exerciseService";

const { width } = Dimensions.get("window");

type RouteProps = RouteProp<RootStackParamList, "ExerciseListScreen">;
type NavigationProps = StackNavigationProp<RootStackParamList, "WorkoutInfo">;

const ExerciseListScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const { bodyPart } = route.params;

  const [workouts, setWorkouts] = useState<Exercise[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchWorkouts = async () => {
      const data = await getExercisesByBodyPart(bodyPart);
      setWorkouts(data);
      setFilteredWorkouts(data);
      setLoading(false);
    };
    fetchWorkouts();
  }, [bodyPart]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = workouts.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredWorkouts(filtered);
  };

  const renderItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("WorkoutInfo", { exercise: item })}
    >
      <Image source={{ uri: item.gifUrl }} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.cardTitle}>{item.name.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0096c7" />
        <Text style={styles.loadingText}>Antrenmanlar yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-circle-outline" size={30} color="#0096c7" />
        </TouchableOpacity>
        <Text style={styles.title}>{bodyPart.toUpperCase()} Antrenmanları</Text>
        <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)} style={styles.searchIcon}>
          <Ionicons name="search" size={24} color="#0096c7" />
        </TouchableOpacity>
      </View>

      {searchVisible && (
        <TextInput
          style={styles.searchInput}
          placeholder="Egzersiz ara..."
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      )}

      <FlatList
        data={filteredWorkouts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ExerciseListScreen;

const CARD_WIDTH = width * 0.44;
const CARD_HEIGHT = width * 0.52;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 30,
    paddingBottom: 15,
  },
  backButton: {
    paddingHorizontal: 8,
  },
  searchIcon: {
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 20,
    color: "#0096c7",
    fontWeight: "bold",
    textAlign: "center",
  },
  searchInput: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#0096c7",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    backgroundColor: "#1e1e1e",
    overflow: "hidden",
    marginBottom: 16,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgba(18,18,18,0.7)",
    width: "100%",
    padding: 8,
    alignItems: "center",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ccc",
    marginTop: 10,
  },
});
