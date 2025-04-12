import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigator/AppNavigator";
import { getBodyParts } from "../src/exerciseService";

const { width } = Dimensions.get("window");

type NavigationProp = StackNavigationProp<RootStackParamList, "ExerciseListScreen">;

interface Props {
  navigation: NavigationProp;
}


const bodyPartToImageMap: { [key: string]: any } = {
  chest: require("../assets/OnTaraf.png"),
  back: require("../assets/Back.png"),
  neck: require("../assets/Neck.png"),
  shoulders: require("../assets/Shoulders.png"),
  "upper arms": require("../assets/UpperArms.png"),
  "lower arms": require("../assets/LowerArms.png"),
  "upper legs": require("../assets/UpperLegs.png"),
  "lower legs": require("../assets/LowerLegs.png"),
  waist: require("../assets/Waist.png"),
  cardio: require("../assets/Run.png"),
};


const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBodyParts = async () => {
      const parts = await getBodyParts();
      setBodyParts(parts);
      setLoading(false);
    };
    fetchBodyParts();
  }, []);

  const renderItem = ({ item }: { item: string }) => {
    const lowerItem = item.toLowerCase();
    const hasImage = lowerItem in bodyPartToImageMap;
    const imageSource = bodyPartToImageMap[lowerItem];

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ExerciseListScreen", { bodyPart: item })}
      >
        {hasImage ? (
          <ImageBackground
            source={imageSource}
            style={styles.imageBackground}
            imageStyle={{ borderRadius: 16 }}
          >
            <Text style={styles.cardText}>{item.toUpperCase()}</Text>
          </ImageBackground>
        ) : (
          <Text style={styles.cardText}>{item.toUpperCase()}</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0096c7" />
        <Text style={styles.loadingText}>Kas grupları yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kas Grubunu Seç</Text>
      <FlatList
        data={bodyParts}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        renderItem={renderItem}
      />
    </View>
  );
};

export default HomeScreen;

const CARD_SIZE = width * 0.42;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0096c7",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#1e1e1e",
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  cardText: {
    color: "#FFFFFF",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,    
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
  },  
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#aaa",
    fontSize: 16,
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
