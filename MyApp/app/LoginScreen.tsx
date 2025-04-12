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
import { FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../src/firebaseConfig";

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
    } catch (error) {
      console.error(error);
      Alert.alert("Login Failed", "Invalid credentials. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Missing Email", "Please enter your email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Password Reset", "Check your email for reset instructions.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to send reset email.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Animatable.View animation="fadeInUp" duration={600} style={styles.content}>
        <Text style={styles.title}>Login Screen</Text>

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

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>

        <TouchableOpacity style={styles.googleButton} onPress={handleLogin}>
          <FontAwesome name="google" size={20} color="#db4437" />
          <Text style={styles.googleButtonText}>Log in with Google</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.footerLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
    fontSize: width * 0.08,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: height * 0.04,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    padding: height * 0.018,
    color: "#fff",
    marginBottom: height * 0.02,
    fontSize: width * 0.04,
    backgroundColor: "#1e1e1e",
  },
  forgotText: {
    color: "#0096c7",
    textAlign: "right",
    marginBottom: height * 0.02,
    fontSize: width * 0.035,
  },
  loginButton: {
    backgroundColor: "#0096c7",
    paddingVertical: height * 0.018,
    borderRadius: 8,
    alignItems: "center",
    marginTop: height * 0.01,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    color: "#aaa",
    marginVertical: height * 0.025,
    fontSize: width * 0.04,
  },
  googleButton: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: height * 0.016,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  googleButtonText: {
    color: "#000",
    marginLeft: 10,
    fontSize: width * 0.04,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: height * 0.035,
  },
  footerText: {
    color: "#aaa",
    fontSize: width * 0.038,
  },
  footerLink: {
    color: "#0096c7",
    fontWeight: "bold",
  },
});
