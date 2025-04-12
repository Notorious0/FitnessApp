# 🏋️ Hypertro - Fitness Workout Tracker App

**Hypertro** is a modern fitness tracking application built with React Native and Firebase.  
It helps users build, manage, and track their workout routines using features like supersets, dropsets, categorized folders, and real-time performance input.

---

## 🎥 Demo Video

Watch the full demo on YouTube:  
👉 [Hypertro - Fitness App Demo](https://www.youtube.com/watch?v=6wpUIr66KNA)

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center"><strong>Muscle Group Selection</strong><br><img src="./MyApp/assets/screenshots/Selection.jpg" width="250"/></td>
    <td align="center"><strong>Exercise List</strong><br><img src="./MyApp/assets/screenshots/Move.jpg" width="250"/></td>
    <td align="center"><strong>Workout Builder</strong><br><img src="./MyApp/assets/screenshots/Superset.jpg" width="250"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Workout Detail</strong><br><img src="./MyApp/assets/screenshots/Detail.jpg" width="250"/></td>
    <td align="center"><strong>Folder System</strong><br><img src="./MyApp/assets/screenshots/Folder.jpg" width="250"/></td>
    <td align="center"><strong>Workout Overview</strong><br><img src="./MyApp/assets/screenshots/Workout.jpg" width="250"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Profile Page</strong><br><img src="./MyApp/assets/screenshots/Profile.jpg" width="250"/></td>
    <td align="center"><strong>Info Page</strong><br><img src="./MyApp/assets/screenshots/Info.jpg" width="250"/></td>
    <td align="center"><strong>BMI Calculator</strong><br><img src="./MyApp/assets/screenshots/BMI.jpg" width="250"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Login</strong><br><img src="./MyApp/assets/screenshots/Login.jpg" width="150"/></td>
    <td align="center"><strong>Register</strong><br><img src="./MyApp/assets/screenshots/Register.jpg" width="150"/></td>
    <td></td>
  </tr>
</table>

---

## 🔥 Features

- Select exercises by muscle group using body map SVGs
- Create workouts with support for **supersets**, **dropsets**, and multiple sets
- Organize workouts into custom folders
- Save workout data locally (or in Firestore)
- Use tools like:
  - BMI calculator
  - 1RM calculator
  - Calorie needs estimator
  - Body measurement tracker
- Secure login with email & Google (Firebase Auth)
- Responsive and dark-themed UI built with Expo

---

## ⚙️ Tech Stack

- ⚛️ **React Native (TypeScript)**
- 🔥 **Firebase (Auth + Firestore)**
- 📦 **Expo**
- 💾 **AsyncStorage**
- 🎨 **Custom SVG rendering for muscle groups**

---

## 🚀 Installation

```bash
git clone https://github.com/YOUR-USERNAME/Hypertro.git
cd Hypertro
npm install
npx expo start
