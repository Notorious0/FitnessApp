import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigator/AppNavigator";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { capitalizeWords } from "./utils/capitalizeWords";


type WorkoutInfoRouteProp = RouteProp<RootStackParamList, "WorkoutInfo">;

const WorkoutInfo = () => {
  const route = useRoute<WorkoutInfoRouteProp>();
  const navigation = useNavigation();
  const { exercise } = route.params;



  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-circle-outline" size={30} color="#00b4d8" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.headerTitle}>
            {capitalizeWords(exercise.name)}
          </Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gifWrapper}>
          <WebView
            source={{
              html: `<img src="${exercise.gifUrl}" style="width: 100%; height: 100%;" autoplay loop />`,
            }}
            style={styles.gif}
            scrollEnabled={false}
          />
          <LinearGradient
            colors={["transparent", "#121212"]}
          />
        </View>

        {/* Talimatlar */}
        {Array.isArray(exercise.instructions) && exercise.instructions.length > 0 && (
    <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Ionicons name="list-circle-outline" size={20} color="#00b4d8" />
      <Text style={styles.cardTitle}>Talimatlar</Text>
    </View>
    {exercise.instructions.map((step: string, index: number) => (
      <Text key={index} style={styles.cardText}>
        {index + 1}. {step}
      </Text>
    ))}
  </View>
    )}

        {/* Detaylar */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="fitness-outline" size={20} color="#00b4d8" />
            <Text style={styles.cardTitle}>Detaylar</Text>
          </View>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>Ekipman:</Text> {exercise.equipment}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>Hedef Kas:</Text> {exercise.target}
          </Text>

          {Array.isArray(exercise.secondaryMuscles) && exercise.secondaryMuscles.length > 0 && (
  <>
    <View style={[styles.cardHeader, { marginTop: 12 }]}>
      <Ionicons name="body-outline" size={20} color="#00b4d8" />
      <Text style={styles.cardTitle}>Yardımcı Kaslar</Text>
    </View>
    {exercise.secondaryMuscles.map((muscle: string, index: number) => (
      <Text key={index} style={styles.cardText}>• {muscle}</Text>
    ))}
  </>
)}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkoutInfo;




const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    height: 60,
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#1e1e1e",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: "50%",
    transform: [{ translateY: -15 }],
    zIndex: 10,
  },
  headerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 50, 
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00b4d8",
    textAlign: "center",
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  gifWrapper: {
    width: "100%",
    aspectRatio: 1.5,
    backgroundColor: "#000",
    overflow: "hidden",
    elevation: 6,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  gif: {
    width: "100%",
    height: "100%",
  },
  card: {
    backgroundColor: "#1e1e1e",
    marginHorizontal: 12,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00b4d8",
  },
  cardText: {
    fontSize: 15,
    color: "#e0e0e0",
    marginBottom: 6,
    lineHeight: 22,
  },
  bold: {
    fontWeight: "bold",
    color: "#facc15",
  },
});
