import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useAuth } from "../app/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigator/AppNavigator";
import * as Animatable from "react-native-animatable";

const { width, height } = Dimensions.get("window");

type AuthNavigationProp = StackNavigationProp<RootStackParamList>;

const SignUpScreen = () => {
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<AuthNavigationProp>();

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert("Missing Fields", "Please fill all fields to continue.");
      return;
    }

    try {
      const userCredential = await signup(email, password, username);
      if (!userCredential) return;
      navigation.navigate("Main");
    } catch (error) {
      console.error(error);
      Alert.alert("Signup Error", "Something went wrong. Try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Animatable.View animation="fadeInUp" duration={600} style={styles.content}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#999"
          onChangeText={setUsername}
          value={username}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    paddingHorizontal: width * 0.08,
  },
  content: {
    width: "100%",
  },
  title: {
    fontSize: width * 0.085,
    fontWeight: "bold",
    color: "white",
    marginBottom: height * 0.04,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1e1e1e",
    padding: height * 0.018,
    borderRadius: 8,
    color: "white",
    marginBottom: height * 0.025,
    fontSize: width * 0.04,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#0096c7",
    paddingVertical: height * 0.018,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: height * 0.02,
  },
  bottomText: {
    color: "white",
    fontSize: width * 0.04,
  },
  link: {
    color: "#0096c7",
    fontWeight: "bold",
    fontSize: width * 0.04,
  },
});
