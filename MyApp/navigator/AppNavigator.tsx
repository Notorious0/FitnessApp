import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../app/AuthContext";
import LoginScreen from "../app/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SignUpScreen from "../app/SignUp";
import TrainingScreen from "../screens/TrainingScreen";
import AddWorkoutScreen from "../screens/AddWorkoutScreen";
import { FontAwesome5 } from "@expo/vector-icons";
import Workouts from "../screens/Workouts";
import WorkoutInfo from "../screens/WorkoutInfo";
import WorkoutStep from "../screens/WorkoutStep";
import WorkoutDetail from "../screens/WorkoutDetail";
import FolderDetail from "../screens/FolderDetail";
import BMICalculator from "../screens/ProfilEkranları/Bmı"
import RMCalculator from "../screens/ProfilEkranları/Rm";
import Calori from "../screens/ProfilEkranları/Calori";
import Pr from "../screens/ProfilEkranları/Pr";
import Body from "../screens/ProfilEkranları/Body";
import ExerciseListScreen from "../screens/ExerciseListScreen";
import { Exercise } from "../screens/types";

export type RootStackParamList = {
  WorkoutStep: {
    selectedExercises?: Exercise[];
    workoutName?: string;
    isEdit?: boolean;
    workoutId?: string | null;
    supersets?: { [key: string]: string };
    supersetColors?: { [key: string]: string };
  };
  WorkoutDetail: { workoutId: string };
  AddWorkoutScreen: {
    existingExercises?: Exercise[];
    workoutName?: string;
    isEdit?: boolean;
    workoutId?: string | null;
    supersets?: { [key: string]: string };
    supersetColors?: { [key: string]: number };
  };
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
  TrainingScreen: { workoutName?: string };
  Workouts: {
    muscleGroup: string;
    existingExercises?: Exercise[];
    workoutName?: string;
    isEdit?: boolean;
    workoutId?: string | null;
    supersets?: { [key: string]: string };
    supersetColors?: { [key: string]: string };
  };
  WorkoutInfo: { exercise: Exercise };
  FolderDetail: { folderId: string; folderName: string };
  BMICalculator: undefined;
  Profile: undefined;
  RMCalculator: undefined;
  Calori: undefined;
  Pr: undefined;
  Body: undefined;
  ExerciseListScreen: { bodyPart: string };
};

const Stack = createStackNavigator<RootStackParamList>();

type BottomTabParamList = {
  Home: undefined;
  Profile: undefined;
  TrainingStack: undefined; 
};

const TrainingStack = createStackNavigator();

function TrainingStackNavigator() {
  return (
    <TrainingStack.Navigator screenOptions={{ headerShown: false }}>
      <TrainingStack.Screen name="TrainingScreen" component={TrainingScreen} />
      <TrainingStack.Screen name="FolderDetail" component={FolderDetail} />
      <TrainingStack.Screen name="AddWorkoutScreen" component={AddWorkoutScreen} />
      <TrainingStack.Screen name="Workouts" component={Workouts} />
      <TrainingStack.Screen name="WorkoutStep" component={WorkoutStep}/>
      <TrainingStack.Screen name="WorkoutDetail" component={WorkoutDetail} />
    </TrainingStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<BottomTabParamList>();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{               
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#121212", 
          borderTopWidth: 0, 
        },
        tabBarActiveTintColor: "#0096c7", 
        tabBarInactiveTintColor: "#0096c7", 
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TrainingStack" 
        component={TrainingStackNavigator} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="dumbbell" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <Stack.Screen name="Main" component={BottomTabNavigator} />
        )}
        <Stack.Screen name="ExerciseListScreen" component={ExerciseListScreen} />
        <Stack.Screen name="WorkoutInfo" component={WorkoutInfo} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen 
          name="BMICalculator" 
          component={BMICalculator}
          options={{  
            title: 'BMI Hesaplama',
            headerStyle: {
              backgroundColor: '#121212',
            },
            headerTintColor: '#0096c7',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="RMCalculator" 
          component={RMCalculator}
          options={{
            title: '1RM Hesaplama',
            headerStyle: {
              backgroundColor: '#121212',
            },
            headerTintColor: '#0096c7',
          }}
        />
        <Stack.Screen 
          name="Calori" 
          component={Calori}
          options={{
            title: 'Kalori Hesaplama',
            headerStyle: {
              backgroundColor: '#121212',
            },
            headerTintColor: '#0096c7',
          }}
        />
        <Stack.Screen 
          name="Pr" 
          component={Pr}
          options={{
            title: 'Powerlifting PR\'larım',
            headerStyle: { backgroundColor: '#121212' },
            headerTintColor: '#0096c7',
          }}
        />
        <Stack.Screen 
          name="Body" 
          component={Body}
          options={{
            title: 'Powerlifting PR\'larım',
            headerStyle: { backgroundColor: '#121212' },
            headerTintColor: '#0096c7',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;