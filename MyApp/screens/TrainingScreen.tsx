import React, { useEffect, useState , useCallback  } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, Platform,
  Modal, TextInput 
} from "react-native";
import { fetchUserWorkouts, deleteUserWorkout , addWorkoutToFolder,createWorkoutFolder, fetchWorkoutFolders } from "../app/firestoreFunctions"; 
import { useNavigation , useFocusEffect  } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigator/AppNavigator"; 
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"; 
import { useAuth } from "../app/AuthContext";  
import { Folder, Workout } from "./types"


type TrainingScreenNavigationProp = StackNavigationProp<RootStackParamList, "TrainingScreen">;

const TrainingScreen = () => {
  const navigation = useNavigation<TrainingScreenNavigationProp>(); 
  const { user } = useAuth();  
  const [workouts, setWorkouts] = useState<Workout[]>([]); 

  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectFolderModal, setSelectFolderModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        if (user) {
          const userWorkouts = await fetchUserWorkouts(user.uid);
          setWorkouts(userWorkouts);
  
          const userFolders = await fetchWorkoutFolders(user.uid);
          setFolders(userFolders);
        }
      };

      loadData();
    }, [user])
  );

  const loadFolders = async () => {
    if (!user) return;
    try {
      const userFolders = await fetchWorkoutFolders(user.uid);
      setFolders(userFolders);
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  useEffect(() => {
    loadFolders();
  }, [user]);

  const handleDelete = async (workoutId: string) => {
    await deleteUserWorkout(workoutId);
    setTimeout(async () => {
      if (user) {
        const userWorkouts = await fetchUserWorkouts(user.uid);
        setWorkouts(userWorkouts);
      }
    }, 500);
  };

  const handleCreateFolder = async () => {
    if (!user || !newFolderName.trim()) return;
    try {
      await createWorkoutFolder(user.uid, newFolderName);
      setFolderModalVisible(false);
      setNewFolderName("");
      await loadFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 Antrenmanlarım</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={() => setFolderModalVisible(true)}
            style={styles.headerButton}
          >
            <FontAwesome5 name="folder-plus" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
    onPress={() => navigation.navigate("AddWorkoutScreen", {})}
    style={styles.headerButton}
  >
    <FontAwesome name="plus" size={24} color="white" />
  </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={folders}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.folderList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.folderBox}
            onPress={() => navigation.navigate("FolderDetail", {
              folderId: item.id,
              folderName: item.folderName
            })}
          >
            <FontAwesome5 name="folder" size={24} color="#0096c7" />
            <Text style={styles.folderText}>{item.folderName}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1, paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.workoutBox} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate("WorkoutDetail", { workoutId: item.id })}
          >
            <View style={styles.workoutContent}>
              <FontAwesome5 name="dumbbell" size={24} color="#0096c7" style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={styles.workoutName}>{item.workoutName}</Text>
                <Text style={styles.workoutSubtext}>Antrenmana başlamak için dokun</Text>
              </View>
              <TouchableOpacity 
                style={styles.folderAddButton}
                onPress={() => {
                  setSelectedWorkout(item);
                  setSelectFolderModal(true);
                }}
              >
                <FontAwesome5 name="folder-plus" size={18} color="#0096c7" />
              </TouchableOpacity>
            </View>
            <FontAwesome5 name="chevron-right" size={20} color="#0096c7" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="clipboard" size={50} color="#0096c7" />
            <Text style={styles.emptyText}>Henüz kaydedilmiş antrenmanınız yok.</Text>
          </View>
        }
      />

      <Modal visible={folderModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Klasör İsmi Gir</Text>
            <TextInput
              value={newFolderName}
              onChangeText={setNewFolderName}
              style={styles.modalInput}
              placeholder="Örnek: Göğüs Günleri"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCreateFolder}
            >
              <Text style={styles.modalButtonText}>Oluştur</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={selectFolderModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Klasör Seç</Text>
            {folders.map((folder) => (
              <TouchableOpacity
                key={folder.id}
                style={styles.modalOption}
                onPress={async () => {
                  if (selectedWorkout) {
                    await addWorkoutToFolder(folder.id, selectedWorkout);
                    setSelectFolderModal(false);
                    setSelectedWorkout(null);
                  }
                }}
              >
                <Text style={styles.modalOptionText}>{folder.folderName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TrainingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '5%', // Responsive padding
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: '#0096c7',
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 30 : 26,
    fontWeight: "bold",
    color: "#0096c7",
    letterSpacing: 0.5,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
  },
  folderList: {
    marginBottom: 15,
  },
  folderBox: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0096c7',
  },
  folderText: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
  },
  emptyText: {
    color: "#8a8a8a",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    lineHeight: 24,
    fontWeight: '500',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30%',
  },
  folderAddButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 15,
    width: '80%',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalInput: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    color: 'white',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#0096c7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalOptionText: {
    color: 'white',
    fontSize: 16,
  },
});