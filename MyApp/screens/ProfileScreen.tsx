import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../app/AuthContext";

type IconName =
  | "scale-outline"
  | "barbell-outline"
  | "trophy-outline"
  | "newspaper-outline"
  | "fitness-outline"
  | "settings-outline"
  | "star-outline"
  | "information-circle-outline";

const profileOptions: { label: string; icon: IconName; color: string }[] = [
  {
    label: "BMI Hesaplama",
    icon: "scale-outline",
    color: "#4CAF50",
  },
  {
    label: "1RM Hesaplama",
    icon: "barbell-outline",
    color: "#2196F3",
  },
  {
    label: "Powerlifting PR'ları",
    icon: "trophy-outline",
    color: "#FFC107",
  },
  {
    label: "Kalori İhtiyacı Hesaplama",
    icon: "newspaper-outline",
    color: "#9C27B0",
  },
  {
    label: "Vücut Ölçümleri",
    icon: "fitness-outline",
    color: "#F44336",
  },
  {
    label: "Ayarlar",
    icon: "settings-outline",
    color: "#607D8B",
  },
  {
    label: "Rate Us",
    icon: "star-outline",
    color: "#FF9800",
  },
  {
    label: "Hakkında",
    icon: "information-circle-outline",
    color: "#00BCD4",
  },
];

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<any, any>;
};

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const { logout } = useAuth();

  const handlePress = (label: string) => {
    switch (label) {
      case "BMI Hesaplama":
        navigation.navigate("BMICalculator");
        break;
      case "1RM Hesaplama":
        navigation.navigate("RMCalculator");
        break;
      case "Kalori İhtiyacı Hesaplama":
        navigation.navigate("Calori");
        break;
      case "Powerlifting PR'ları":
        navigation.navigate("Pr");
        break;
      case "Vücut Ölçümleri":
        navigation.navigate("Body");
        break;
      default:
        console.log(`${label} sayfasına yönlendir`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Çıkış hatası:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Profil</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {profileOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => handlePress(item.label)}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: item.color }]}
            >
              <Ionicons name={item.icon} size={24} color="white" />
            </View>
            <Text style={styles.label}>{item.label}</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color="#666"
              style={styles.arrow}
            />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#1E1E1E",
    borderBottomWidth: 1,
    borderBottomColor: "#2D2D2D",
  },
  header: {
    color: "#0096c7",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "left",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1E1E1E",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#0096c7",
    fontWeight: "500",
  },
  arrow: {
    opacity: 0.7,
    color: "#0096c7",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#B91C1C",
    borderRadius: 16,
    margin: 16,
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
