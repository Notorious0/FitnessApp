import { db } from "../src/firebaseConfig";
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  DocumentData,
  getDoc,
  orderBy
} from "firebase/firestore";

export interface Exercise {
  id: string;
  name: string;
  gifUrl?: string;
  equipment?: string;
  target?: string;
  secondaryMuscles?: string[];
  instructions?: string[];
  sets?: {
    kg: string;
    reps: string;
    repDisplay?: string;
    weightUnit?: string;
    repType?: string;
  }[];
}

export interface Workout {
  id: string;
  workoutName: string;
  createdAt?: any;
  exercises: Exercise[];
  supersets?: { [key: string]: string };
  supersetColors?: { [key: string]: string };
}

export const saveUserWorkout = async (
  userId: string,
  workoutName: string,
  exercises: {
    id: string;
    name: string;
    gifUrl: string;
    sets: {
      kg: string;
      reps: string;
      repDisplay?: string;
      weightUnit?: string;
      repType?: string;
    }[];
  }[],
  supersets: { [key: string]: string },
  supersetColors: { [key: string]: string }
): Promise<void> => {
  try {
    if (!userId) throw new Error("Kullanıcı giriş yapmamış!");

    await addDoc(collection(db, "user_workouts"), {
      uid: userId,
      workoutName: workoutName || "Bilinmeyen Antrenman",
      exercises: exercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        gifUrl: ex.gifUrl,
        sets: ex.sets || [],
      })),
      supersets: supersets || {},
      supersetColors: supersetColors || {},
      createdAt: Timestamp.now(), // 🔥 Tarih bilgisi
    });

    console.log("🔥 Antrenman başarıyla kaydedildi!");
  } catch (error) {
    console.error("❌ Antrenman kaydedilirken hata oluştu:", error);
  }
};

export const fetchUserWorkouts = async (userId: string): Promise<Workout[]> => {
  try {
    if (!userId) {
      console.error("❌ Kullanıcı giriş yapmamış!");
      return [];
    }

    const q = query(
      collection(db, "user_workouts"),
      where("uid", "==", userId),
      orderBy("createdAt", "desc") // 🔥 Son eklenen en üstte
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn("⚠️ Bu kullanıcıya ait antrenman bulunamadı.");
      return [];
    }

    const workouts = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        workoutName: data.workoutName || "Bilinmeyen Antrenman",
        createdAt: data.createdAt?.toDate() || null,
        exercises: data.exercises?.map((exercise: any) => ({
          id: exercise.id || "",
          name: exercise.name || "Unknown Exercise",
          gifUrl: exercise.gifUrl || "",
          sets: exercise.sets?.map((set: any) => ({
            kg: set.kg || "0",
            reps: set.reps || "0",
            repDisplay: set.repDisplay || "",
            weightUnit: set.weightUnit || "KG",
            repType: set.repType || "Reps",
          })) || [],
        })) || [],
        supersets: data.supersets || {},
        supersetColors: data.supersetColors || {},
      };
    });

    console.log("✅ İşlenmiş Antrenman Listesi:", workouts);
    return workouts;
  } catch (error) {
    console.error("❌ Antrenmanlar çekilirken hata oluştu:", error);
    return [];
  }
};


export const fetchWorkoutById = async (
  userId: string,
  workoutId: string
): Promise<Workout | null> => {
  try {
    if (!userId || !workoutId) {
      console.error("❌ Kullanıcı ID veya Antrenman ID eksik!");
      return null;
    }

    const q = query(
      collection(db, "user_workouts"),
      where("uid", "==", userId),
      where("__name__", "==", workoutId)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn("⚠️ Antrenman bulunamadı.");
      return null;
    }

    const docData = snapshot.docs[0].data();
    console.log("✅ Çekilen Antrenman Verisi:", docData);

    return {
      id: snapshot.docs[0].id,
      workoutName: docData.workoutName || "Bilinmeyen Antrenman",
      exercises: docData.exercises?.map((exercise: any) => ({
        id: exercise.id || "",
        name: exercise.name || "Unknown Exercise",
        gifUrl: exercise.gifUrl || "",
        sets:
          exercise.sets?.map((set: any) => ({
            kg: set.kg || "0",
            reps: set.reps || "0",
            repDisplay: set.repDisplay || "",
            weightUnit: set.weightUnit || "KG",
            repType: set.repType || "Reps"
          })) || []
      })) || [],
      supersets: docData.supersets || {},
      supersetColors: docData.supersetColors || {}
    };
  } catch (error) {
    console.error("❌ Antrenman çekilirken hata oluştu:", error);
    return null;
  }
};

export const updateUserWorkout = async (
  userId: string,
  workoutId: string,
  workoutName: string,
  exercises: any[],
  supersets: { [key: string]: string },
  supersetColors: { [key: string]: string }
): Promise<boolean> => {
  try {
    const workoutRef = doc(db, "user_workouts", workoutId);

    await updateDoc(workoutRef, {
      uid: userId,
      workoutName: workoutName,
      exercises,
      supersets,
      supersetColors,
      updatedAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error("Error updating workout:", error);
    throw error;
  }
};

export const deleteUserWorkout = async (workoutId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "user_workouts", workoutId));
    console.log("🗑️ Antrenman başarıyla silindi!");
  } catch (error) {
    console.error("❌ Antrenman silinirken hata oluştu:", error);
  }
};

export const createWorkoutFolder = async (
  userId: string,
  folderName: string
): Promise<string | null> => {
  try {
    const folderRef = await addDoc(collection(db, "user_workout_folders"), {
      uid: userId,
      folderName,
      createdAt: serverTimestamp(),
      workouts: []
    });
    console.log("📁 Klasör oluşturuldu:", folderRef.id);
    return folderRef.id;
  } catch (error) {
    console.error("❌ Klasör oluşturulurken hata:", error);
    return null;
  }
};

export const fetchWorkoutFolders = async (
  userId: string
): Promise<{ id: string; folderName: string }[]> => {
  try {
    const q = query(collection(db, "user_workout_folders"), where("uid", "==", userId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      folderName: doc.data().folderName || ""
    }));
  } catch (error) {
    console.error("❌ Klasörler getirilirken hata:", error);
    return [];
  }
};

export const addWorkoutToFolder = async (
  folderId: string,
  workoutData: any
): Promise<void> => {
  try {
    const folderRef = doc(db, "user_workout_folders", folderId);
    const folderSnap = await getDoc(folderRef);

    if (!folderSnap.exists()) throw new Error("Klasör bulunamadı");

    const existingWorkouts = folderSnap.data().workouts || [];
    const updatedWorkouts = [...existingWorkouts, workoutData];

    await updateDoc(folderRef, {
      workouts: updatedWorkouts,
      updatedAt: serverTimestamp()
    });
    console.log("✅ Antrenman klasöre eklendi.");
  } catch (error) {
    console.error("❌ Klasöre antrenman eklenirken hata:", error);
  }
};

export const fetchFolderWorkouts = async (folderId: string): Promise<any[]> => {
  try {
    const folderRef = doc(db, "user_workout_folders", folderId);
    const folderDoc = await getDoc(folderRef); // 🔄 Tek belgeyi doğrudan çek

    if (!folderDoc.exists()) return [];

    const data = folderDoc.data();
    return data.workouts || [];
  } catch (error) {
    console.error("❌ Klasör antrenmanları getirilirken hata:", error);
    return [];
  }
};

export const reorderFolderWorkouts = async (
  folderId: string,
  reorderedWorkouts: any[]
): Promise<void> => {
  try {
    const folderRef = doc(db, "user_workout_folders", folderId);
    await updateDoc(folderRef, {
      workouts: reorderedWorkouts,
      updatedAt: serverTimestamp()
    });
    console.log("✅ Klasör antrenman sırası güncellendi.");
  } catch (error) {
    console.error("❌ Antrenman sırası güncellenirken hata:", error);
  }
};

export const removeWorkoutFromFolder = async (folderId: string, workoutId: string) => {
  try {
    const folderRef = doc(db, 'user_workout_folders', folderId);
    const folderDoc = await getDoc(folderRef);
    
    if (folderDoc.exists()) {
      const workouts = folderDoc.data().workouts || [];
      const updatedWorkouts = workouts.filter((w: any) => w.id !== workoutId);
      
      await updateDoc(folderRef, {
        workouts: updatedWorkouts
      });
    }
  } catch (error) {
    console.error('Error removing workout from folder:', error);
    throw error;
  }
};

export const deleteFolder = async (folderId: string) => {
  try {
    await deleteDoc(doc(db, 'user_workout_folders', folderId));
    console.log("🗑️ Klasör başarıyla silindi!");
  } catch (error) {
    console.error('❌ Klasör silinirken hata oluştu:', error);
    throw error;
  }
};

