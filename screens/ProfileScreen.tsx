import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useAuth } from "../app/AuthContext";

const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
      <Button title="Login" onPress={() => login(email, password)} />
      <Button title="Sign in with Google"  />
    </View>
  );
};

export default LoginScreen;
