import React, { useState ,useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  ScrollView,
  Modal
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigator/AppNavigator";
import AntDesign from '@expo/vector-icons/AntDesign';
import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from "@react-navigation/stack";
import { saveUserWorkout, updateUserWorkout } from "../app/firestoreFunctions";
import { useAuth } from "../app/AuthContext";
import { Exercise, SetData, SupersetColors, SupersetColorMap } from "./types";


const { width } = Dimensions.get("window");

type WorkoutStepRouteProp = RouteProp<RootStackParamList, "WorkoutStep">;




const SUPERSET_COLORS = [
  { bg: 'rgba(255, 99, 132, 0.15)', text: '#ff6384' },   // Kırmızı
  { bg: 'rgba(54, 162, 235, 0.15)', text: '#36a2eb' },   // Mavi
  { bg: 'rgba(255, 206, 86, 0.15)', text: '#ffce56' },   // Sarı
  { bg: 'rgba(75, 192, 192, 0.15)', text: '#4bc0c0' },   // Turkuaz
  { bg: 'rgba(153, 102, 255, 0.15)', text: '#9966ff' },  // Mor
];


type WorkoutScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const WorkoutStep = () => {
  const navigation = useNavigation<WorkoutScreenNavigationProp>(); // navigation işlemi
  const route = useRoute<WorkoutStepRouteProp>(); // route param
  const { 
    selectedExercises = [], 
    workoutName: initialWorkoutName,
    isEdit = false,
    workoutId = null,
  } = route.params ?? {};
  const [modalVisible,setModalVisible] = useState(false); 
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(''); // Seçilen egzersiz idsi saklar
  const [selectedSetIndex, setSelectedSetIndex] = useState<number>(0); 
  const [weightUnit, setWeightUnit] = useState<{[key: string]: string}>({}); //Agırlı chooser
  const [workoutName, setWorkoutName] = useState("New Workout"); 
  const [menuVisible, setMenuVisible] = useState(false); 
  const [selectedExerciseForMenu, setSelectedExerciseForMenu] = useState<string>('');  //Seçilen egzersiz
  const [supersetModalVisible, setSupersetModalVisible] = useState(false); 
  const [supersets, setSupersets] = useState<{[key: string]: string}>({}); //key egzreiz id,value süperset id
  const [swapMode, setSwapMode] = useState(false); 
  const [firstExercise, setFirstExercise] = useState<string | null>(null); // Yer değiştirme modu
  const [supersetColors, setSupersetColors] = useState<SupersetColors>({}); //key süperset id si value renk indexi
  const { user } = useAuth();
  const [exerciseData, setExerciseData] = useState<any[]>([]);

  useEffect(() => {
    if (route.params?.workoutName) {
      setWorkoutName(route.params.workoutName);
    }
  }, [route.params?.workoutName]);
  

  useEffect(() => {
    setExerciseData((prevData) => {
      const updatedExercises = [...prevData];
  
      selectedExercises.forEach((newExercise) => {
        const existingExercise = updatedExercises.find((ex) => ex.id === newExercise.id);
  
        if (!existingExercise) {
          updatedExercises.push({
            ...newExercise,
            gifUrl: newExercise.gifUrl || "",
            sets: "sets" in newExercise ? newExercise.sets : [{ kg: "", reps: "", repDisplay: "" }],
          });
        }
      });
  
      return updatedExercises;
    });
  
    // Superset verileri varsa ekle
    if (route.params?.supersets) {
      setSupersets(route.params.supersets);
    }
  
    if (route.params?.supersetColors) {
      const colorIndexMap: SupersetColors = {};
      Object.entries(route.params.supersetColors).forEach(([exerciseId, colorValue]) => {
        const colorIndex = SUPERSET_COLORS.findIndex((color) => color.text === colorValue);
        if (colorIndex !== -1) {
          colorIndexMap[exerciseId] = colorIndex;
        }
      });
      setSupersetColors(colorIndexMap);
    }
  
  }, [selectedExercises, route.params]);
  
  
  
  
  const [repTypeModalVisible, setRepTypeModalVisible] = useState(false); //terkrar seçme modalı açıp kapama
  const [repType, setRepType] = useState<{[key: string]: string}>({});  // !!!!

  const handleUnitPress = (exerciseId : string , setIndex :number) => {
    setSelectedExerciseId(exerciseId);
    setSelectedSetIndex(setIndex);
    setModalVisible(true);
  }

  const addSet = (exerciseId: string) => {
    setExerciseData((prevData) => {
      return prevData.map((ex) => {
        if (ex.id === exerciseId) {
          const updatedSets = [...ex.sets, { kg: "", reps: "", repDisplay: "" }];
          return { ...ex, sets: updatedSets };
        }
        return ex;
      });
    });
  };
  

  const updateSet = (
    exerciseId: string,
    setIndex: number,
    field: "kg" | "reps",
    value: string 
  ) => {
    setExerciseData((prevData) =>
      prevData.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set: SetData, index: number) =>
                index === setIndex
                  ? { 
                      ...set, 
                      [field]: value,
                      repDisplay: field === "reps" && set.repDisplay ? set.repDisplay : set.repDisplay
                    }
                  : set
              ),
            }
          : ex
      )
    );    
  };

  const selectUnit = (unit: string) => { 
    setWeightUnit({
      ...weightUnit,
      [`${selectedExerciseId}-${selectedSetIndex}`]: unit 
    });

    setExerciseData((prevData) =>
      prevData.map((ex) =>
        ex.id === selectedExerciseId
          ? {
              ...ex,
              sets: ex.sets
                ? ex.sets.map((set: SetData, index: number) =>
                    index === selectedSetIndex
                      ? {
                          ...set,
                          kg: unit === 'MAX' ? 'MAX' : set.kg
                        }
                      : set
                  )
                : [{ kg: unit === 'MAX' ? 'MAX' : "", reps: "", repDisplay: "" }], // Eğer sets boşsa yeni bir dizi oluştur
            }
          : ex
      )
    );    
    setModalVisible(false);
  };

  const handleRepTypePress = (exerciseId: string, setIndex: number) => {
    setSelectedExerciseId(exerciseId);
    setSelectedSetIndex(setIndex);
    setRepTypeModalVisible(true);
  };

  const selectRepType = (type: string) => { //kg kısmının rep hali
    setRepType({
      ...repType,
      [`${selectedExerciseId}-${selectedSetIndex}`]: type
    });

    setExerciseData((prevData) =>
  prevData.map((ex) =>
    ex.id === selectedExerciseId
      ? {
          ...ex,
          sets: ex.sets
            ? ex.sets.map((set: SetData, index: number) =>
                index === selectedSetIndex
                  ? { 
                      ...set,
                      repDisplay: type === 'Repetitions' ? '' 
                                : type === 'FL' ? 'FAILURE'
                                : type === 'DS' ? 'DROPSET' 
                                : '',
                      reps: type === 'Repetitions' ? set.reps : ''
                    }
                  : set
              )
            : [{ kg: "", reps: "", repDisplay: type === 'FL' ? 'FAILURE' : type === 'DS' ? 'DROPSET' : "" }], // Eğer sets boşsa yeni bir dizi oluştur
        }
      : ex
  )
);
    setRepTypeModalVisible(false);
  };

  const handleExerciseMenu = (exerciseId: string) => {
    setSelectedExerciseForMenu(exerciseId);
    setMenuVisible(true);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setExerciseData(prevData => prevData.filter(ex => ex.id !== exerciseId));
    setMenuVisible(false);
  };

  const handleSuperset = () => {
    setSupersetModalVisible(true);
    setMenuVisible(false);
  };

  const addSuperset = (secondExerciseId: string) => {
    const colorIndex = Object.keys(supersetColors).length % SUPERSET_COLORS.length; //süper set rengini son kısmda uzunluk a göre seçer
    
    setSupersets({
      ...supersets,
      [selectedExerciseForMenu]: secondExerciseId, //seçilen egzersizi bağlama
      [secondExerciseId]: selectedExerciseForMenu
    });
    
    setSupersetColors({
      ...supersetColors,
      [selectedExerciseForMenu]: colorIndex, //birinci eg renk atanıyor
      [secondExerciseId]: colorIndex // ikincisine aynı renk atanır
    });
    
    setSupersetModalVisible(false);
  };

  const handleSwapStart = () => {
    setSwapMode(true);
    setFirstExercise(selectedExerciseForMenu);
    setMenuVisible(false);
  };

  const handleSwapExercise = (secondExerciseId: string) => { //egzersiz yerini değişme
    if (firstExercise && firstExercise !== secondExerciseId) {
      const firstIndex = exerciseData.findIndex(ex => ex.id === firstExercise);
      const secondIndex = exerciseData.findIndex(ex => ex.id === secondExerciseId);
  
      const newData = [...exerciseData];
      [newData[firstIndex], newData[secondIndex]] = [newData[secondIndex], newData[firstIndex]];
      
      setExerciseData(newData);
      setSwapMode(false);
      setFirstExercise(null);
    }
  };
  const handleSaveWorkout = async () => {
    if (!user) {
      console.log("Kullanıcı giriş yapmamış!");
      return;
    }

    const formattedExercises = exerciseData.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      gifUrl: exercise.gifUrl || "",
      sets: exercise.sets
        ? exercise.sets.map((set: SetData, index: number) => ({
            ...set,
            weightUnit: weightUnit[`${exercise.id}-${index}`] || 'KG',
            repType: repType[`${exercise.id}-${index}`] || 'Reps',
          }))
        : [],
    }));

    const formattedSupersetColors = Object.keys(supersets).reduce((colors: SupersetColorMap, exerciseId) => {
      if (!colors[exerciseId] && typeof supersetColors[exerciseId] === 'number') {
        const colorIndex = supersetColors[exerciseId];
        colors[exerciseId] = SUPERSET_COLORS[colorIndex >= 0 && colorIndex < SUPERSET_COLORS.length 
          ? colorIndex 
          : 0].text;
      }
      return colors;
    }, {});

    try {
      // Log kontrolleri ekleyelim
      console.log('isEdit:', isEdit);
      console.log('workoutId:', workoutId);
      
      if (isEdit && workoutId) {
        console.log('Antrenman güncelleniyor...');
        await updateUserWorkout(
          user.uid,
          workoutId,
          workoutName,
          formattedExercises,
          supersets,
          formattedSupersetColors
        );
        console.log('Antrenman başarıyla güncellendi!');
      } else {
        console.log('Yeni antrenman kaydediliyor...');
        await saveUserWorkout(
          user.uid,
          workoutName,
          formattedExercises,
          supersets,
          formattedSupersetColors
        );        
        console.log('Yeni antrenman başarıyla kaydedildi!');
      }

      navigation.navigate("TrainingScreen", { workoutName });
    } catch (error) {
      console.error("Antrenman işlemi sırasında hata oluştu:", error);
    }
};


  return (
    <View style={styles.container}>
      {/* Üst Kısım (Header) */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back-outline" size={30} color="white" />
        </TouchableOpacity>
        <TextInput
          style={styles.workoutName}
          value={workoutName}
          onChangeText={setWorkoutName}
        />
        <Ionicons name="create-outline" size={20} color="white" />
      </View>

      {/* Egzersiz Listesi */}
      <ScrollView>
        {exerciseData.map((exercise) => (
          <TouchableOpacity 
            key={exercise.id || String(Math.random())}
            onPress={() => swapMode && exercise.id ? handleSwapExercise(exercise.id) : undefined}
            activeOpacity={swapMode ? 0.7 : 1}
          >
            <View style={[
              styles.exerciseCard,
              swapMode && firstExercise === exercise.id && styles.selectedForSwap
            ]}>
              <View style={styles.exerciseHeader}>
                <Image
                  source={{ uri: exercise.gifUrl || 'default_image_url' }}
                  style={styles.exerciseImage}
                />
                <View style={styles.exerciseTitleContainer}>
                  <Text style={styles.exerciseTitle}>
                    {exercise.name || "Unknown Exercise"}
                  </Text>
                  <Text style={styles.exerciseSubtitle}>
                    {exercise.sets?.length ? `${exercise.sets.length} Set` : "No Sets"}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.menuButton}
                  onPress={() => exercise.id && handleExerciseMenu(exercise.id)}
                >
                  <MaterialIcons name="more-vert" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* Superset indicator with null check */}
              {exercise.id && supersets[exercise.id] && (
                <View style={[
                  styles.supersetIndicator,
                  { 
                    backgroundColor: typeof supersetColors[exercise.id] === 'number' 
                      ? SUPERSET_COLORS[supersetColors[exercise.id]].bg 
                      : SUPERSET_COLORS[0].bg 
                  }
                ]}>
                  <Ionicons 
                    name="flash" 
                    size={16} 
                    color={typeof supersetColors[exercise.id] === 'number'
                      ? SUPERSET_COLORS[supersetColors[exercise.id]].text
                      : SUPERSET_COLORS[0].text
                    } 
                  />
                  <Text style={[
                    styles.supersetText,
                    { 
                      color: typeof supersetColors[exercise.id] === 'number'
                        ? SUPERSET_COLORS[supersetColors[exercise.id]].text
                        : SUPERSET_COLORS[0].text 
                    }
                  ]}>
                    SUPERSET
                  </Text>
                </View>
              )}

              <View style={styles.setContainer}>
              {exercise.sets?.map((set: SetData, index: number) => (
                  <View key={index} style={styles.setRow}>
                    <Text style={styles.setIndex}>{index + 1}</Text>
                    <TouchableOpacity onPress={() => handleUnitPress(exercise.id, index)}>
                      <View style={styles.unitContainer}>
                        <Text style={styles.unitText}>
                          {weightUnit[`${exercise.id}-${index}`] || 'KG'}
                        </Text>
                        <AntDesign name="caretdown" size={8} color="white" style={styles.iconStyle} />
                      </View>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      placeholder="KG"
                      value={set.kg}
                      editable={weightUnit[`${exercise.id}-${index}`] !== 'MW'}
                      onChangeText={(text) =>
                        updateSet(exercise.id, index, "kg", text)
                      }
                    />
                    <TouchableOpacity onPress={() => handleRepTypePress(exercise.id, index)}>
                      <View style={styles.unitContainer}>
                        <Text style={styles.unitText}>
                          {repType[`${exercise.id}-${index}`] || 'Reps'}
                        </Text>
                        <AntDesign name="caretdown" size={8} color="white" style={styles.iconStyle} />
                      </View>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      placeholder="Reps"
                      value={set.repDisplay || set.reps}
                      editable={!set.repDisplay}
                      onChangeText={(text) =>
                        updateSet(exercise.id, index, "reps", text)
                      }
                    />
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addSetButton}
                  onPress={() => addSet(exercise.id)}
                >
                  <Text style={styles.addSetText}>+ Set ekle</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        {/* Egzersiz Ekle Butonu */}
        <TouchableOpacity 
          style={styles.addExerciseButton} 
          onPress={() => navigation.navigate('AddWorkoutScreen', {
            existingExercises: exerciseData,
            workoutName,
            isEdit,
            workoutId,
            supersets,
            supersetColors,
          })}
        >
          <Text style={styles.addExerciseText}>+ Egzersizler ekle</Text>
        </TouchableOpacity>

        {/* Kaydet Butonu */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
  <Text style={styles.saveButtonText}>KAYDET</Text>
</TouchableOpacity>

      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Birim Seçin</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => selectUnit('KG')}
            >
              <Text style={styles.modalOptionText}>KG</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => selectUnit('MAX')}
            >
              <Text style={styles.modalOptionText}>MAX</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={repTypeModalVisible}
        onRequestClose={() => setRepTypeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tekrar Tipi Seçin</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => selectRepType('Reps')}
            >
              <Text style={styles.modalOptionText}>Reps</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => selectRepType('FL')}
            >
              <Text style={styles.modalOptionText}>Failure</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => selectRepType('DS')}
            >
              <Text style={styles.modalOptionText}>Dropset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setRepTypeModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleSuperset}
            >
              <Text style={styles.modalOptionText}>Süper Set Ekle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleSwapStart}
            >
              <Text style={styles.modalOptionText}>Yer Değiştir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalOption, styles.deleteOption]}
              onPress={() => handleDeleteExercise(selectedExerciseForMenu)}
            >
              <Text style={styles.deleteOptionText}>Sil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={supersetModalVisible}
        onRequestClose={() => setSupersetModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Süper Set için Egzersiz Seçin</Text>
            {exerciseData
              .filter(ex => ex.id !== selectedExerciseForMenu && !supersets[ex.id])
              .map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.modalOption}
                  onPress={() => addSuperset(exercise.id)}
                >
                  <Text style={styles.modalOptionText}>{exercise.name}</Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setSupersetModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    padding: 10,
  },
  workoutName: {
    flex: 1,
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  addExerciseButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  addExerciseText: {
    color: "white",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#0096c7",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
  subText: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 15,
  },
  exerciseCard: {
    backgroundColor: "#1e1e1e",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  exerciseImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },
  exerciseTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  exerciseTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  exerciseSubtitle: {
    color: "#bbb",
    fontSize: 14,
  },
  setContainer: {
    marginTop: 10,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  setIndex: {
    color: "white",
    fontSize: 16,
    width: 20,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    marginHorizontal: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#333",
    borderRadius: 10,
    textAlign: "center",
  },
  addSetButton: {
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  addSetText: {
    color: "white",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalOption: {
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalOptionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 20,
  },
  modalCloseButtonText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  unitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  unitText: {
    color: 'white',
    fontSize: 10,
    marginRight: 4,
  },
  iconStyle: {
    marginLeft: 2,
  },
  menuButton: {
    padding: 8,
  },
  deleteOption: {
    borderBottomWidth: 0,
  },
  deleteOptionText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
  },
  supersetIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  supersetText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    letterSpacing: 1,
  },
  selectedForSwap: {
    borderWidth: 2,
    borderColor: '#0096c7',
    backgroundColor: '#2a2a2a',
  },
});

export default WorkoutStep;