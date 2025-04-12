import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useAuth } from "../app/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigator/AppNavigator";
import { FontAwesome } from "@expo/vector-icons";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../src/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

type AuthNavigationProp = StackNavigationProp<RootStackParamList>;

const SignUpScreen = () => {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Ad alanı
  const [surname, setSurname] = useState(""); // Soyad alanı

  const navigation = useNavigation<AuthNavigationProp>();

  const handleSignUp = async () => {
    try {
        const userCredential = await signup(email, password, name, surname);
        if (!userCredential) return; // Eğer userCredential gelmezse işlemi durdur
        
        navigation.navigate("Main");
    } catch (error) {
        console.error(error);
    }
};


  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          name: user.displayName || "",
          surname: "",
          uid: user.uid,
          createdAt: new Date(),
        });
      }

      navigation.navigate("Main");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#aaa" onChangeText={setName} value={name} />
      <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#aaa" onChangeText={setSurname} value={surname} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" onChangeText={setEmail} value={email} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry onChangeText={setPassword} value={password} />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.divider}>Or Sign Up with</Text>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
        <FontAwesome name="google" size={24} color="white" />
        <Text style={styles.googleButtonText}>Sign Up with Google</Text>
      </TouchableOpacity>
      <View style={styles.signInContainer}>
  <Text style={styles.signInText}>Already have an account?</Text>
  <TouchableOpacity onPress={() => navigation.navigate("Login")}>
    <Text style={styles.signInLink}> Sign In</Text>
  </TouchableOpacity>
</View>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: width * 0.05,
    justifyContent: "center",
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "white",
    marginBottom: height * 0.03,
  },
  input: {
    backgroundColor: "#1e1e1e",
    padding: height * 0.02,
    borderRadius: 8,
    color: "white",
    marginBottom: height * 0.02,
    width: "100%",
  },
  button: {
    backgroundColor: "#0072ff",
    padding: height * 0.02,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: height * 0.03,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: width * 0.05,
  },
  divider: {
    color: "white",
    textAlign: "center",
    marginVertical: height * 0.02,
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#db4437",
    padding: height * 0.02,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: height * 0.03,
    width: "100%",
  },
  googleButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: width * 0.04,
    marginLeft: 10,
  },
  signInContainer: {
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: height * 0.02, 
  },
  signInText: {
    color: "white",
    fontSize: width * 0.04, 
  },
  signInLink: {
    color: "#4caf50",
    fontWeight: "bold",
    fontSize: width * 0.04,
    marginLeft: width * 0.01, 
  },
  
});
