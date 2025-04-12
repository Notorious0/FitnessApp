import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useAuth } from "../app/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigator/AppNavigator";
import { FontAwesome } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

type AuthNavigationProp = StackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation<AuthNavigationProp>();

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigation.navigate("Main");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" onChangeText={setEmail} value={email} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry onChangeText={setPassword} value={password} />
      <Text style={styles.forgotPassword}>Forgot password?</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <Text style={styles.divider}>Or Sign In with</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.signUpContainer}>
  <Text style={styles.signUpText}>Don't have an account?</Text>
  <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
    <Text style={styles.signUpLink}> Sign Up</Text>
  </TouchableOpacity>
</View>
    </View>
  );
};

export default LoginScreen;

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
  forgotPassword: {
    color: "#4caf50",
    fontWeight: "bold",
    alignSelf: "flex-end",
    marginBottom: height * 0.03,
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
    margin: height * 0.03,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: height * 0.03,
  },
  socialButton: {
    backgroundColor: "#1e1e1e",
    padding: height * 0.02,
    borderRadius: 8,
  },
  signUpContainer: {
    flexDirection: "row", 
    justifyContent: "center",
    alignItems: "center", 
    marginTop: height * 0.02, 
  },
  signUpText: {
    color: "white",
    fontSize: width * 0.04, 
  },
  signUpLink: {
    color: "#4caf50",
    fontWeight: "bold",
    fontSize: width * 0.04,
    marginLeft: width * 0.01, 
  },
  
});