import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigator/AppNavigator";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import DraggableFlatList from "react-native-draggable-flatlist";
import { reorderFolderWorkouts, fetchFolderWorkouts, removeWorkoutFromFolder, deleteFolder,deleteUserWorkout } from "../app/firestoreFunctions";
import { FontAwesome5 } from "@expo/vector-icons";

type FolderDetailRouteProp = RouteProp<RootStackParamList, "FolderDetail">;
type NavigationProp = StackNavigationProp<RootStackParamList>;

interface FolderWorkout {
  id: string;
  workoutName: string;
}

const FolderDetailScreen = () => {
  const route = useRoute<FolderDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { folderId, folderName } = route.params;

  const [workouts, setWorkouts] = useState<FolderWorkout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    const data = await fetchFolderWorkouts(folderId);
    setWorkouts(data as FolderWorkout[]);
    setLoading(false);
  };

  const handleReorder = async (newData: FolderWorkout[]) => {
    setWorkouts(newData);
    await reorderFolderWorkouts(folderId, newData);
  };

  const handleDelete = async (workoutId: string) => {
    Alert.alert(
      "Antrenmanı Sil",
      "Bu antrenmanı klasörden silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true); 
              await removeWorkoutFromFolder(folderId, workoutId);
              await deleteUserWorkout(workoutId);
              await loadWorkouts(); 
            } catch (error) {
              console.error('Error deleting workout:', error);
            } finally {
              setLoading(false); 
            }
          }
        }
      ]
    );
  };
  

  const handleDeleteFolder = () => {
    Alert.alert(
      "Klasörü Sil",
      "Bu klasörü silmek istediğinize emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFolder(folderId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting folder:', error);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({
    item,
    drag,
    isActive,
  }: {
    item: FolderWorkout;
    drag: () => void;
    isActive: boolean;
  }) => (
    <TouchableOpacity 
      style={[styles.workoutBox, isActive && styles.activeItem]}
      activeOpacity={0.7}
      onPress={() => navigation.navigate("WorkoutDetail", { workoutId: item.id })}
      onLongPress={drag}
    >
      <View style={styles.workoutContent}>
        <FontAwesome5 name="dumbbell" size={24} color="#0096c7" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.workoutName}>{item.workoutName}</Text>
          <Text style={styles.workoutSubtext}>Sıralamak için basılı tut</Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <FontAwesome5 name="trash" size={18} color="rgba(255, 99, 99, 0.8)" />
        </TouchableOpacity>
      </View>
      <FontAwesome5 name="chevron-right" size={20} color="#0096c7" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0096c7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{folderName}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => {/* Add share functionality here */}}
          >
            <FontAwesome5 name="share-alt" size={20} color="#0096c7" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteFolder}
            onPress={handleDeleteFolder}
          >
            <FontAwesome5 name="trash" size={20} color="rgba(255, 99, 99, 0.8)" />
          </TouchableOpacity>
        </View>
      </View>
      <DraggableFlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={({ data }) => handleReorder(data)}
      />
    </View>
  );
};

export default FolderDetailScreen;

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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  workoutBox: {
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 15,
    marginBottom: 15,
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#0096c7",
    shadowOffset: { 
      width: 0, 
      height: 4 
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#0096c7",
  },
  workoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  workoutSubtext: {
    fontSize: 12,
    color: "#0096c7",
    opacity: 0.8,
  },
  icon: {
    marginRight: 5,
    width: 24,
  },
  deleteButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 99, 99, 0.08)', // Softer red background
    borderRadius: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 99, 99, 0.15)',
    shadowColor: 'rgba(255, 99, 99, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  activeItem: {
    backgroundColor: "#2c2c2c",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerButton: {
    padding: 12,
    backgroundColor: 'rgba(0, 150, 199, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 150, 199, 0.15)',
    shadowColor: 'rgba(0, 150, 199, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  deleteFolder: {
    padding: 12, // Reduced from 14
    backgroundColor: 'rgba(255, 99, 99, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 99, 99, 0.15)',
    shadowColor: 'rgba(255, 99, 99, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  }
});
