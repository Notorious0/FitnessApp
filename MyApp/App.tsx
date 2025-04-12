import React from "react";
import { AuthProvider } from "./app/AuthContext";
import AppNavigator from "./navigator/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
