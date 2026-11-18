
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  // @ts-expect-error Firebase React Native export is missing from some type declarations
  getReactNativePersistence,
} from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB_KRIOvUpWHjxOEH8FQDWmQjDYip5Hk1g",
  authDomain: "spendwise-713e5.firebaseapp.com",
  projectId: "spendwise-713e5",
  storageBucket: "spendwise-713e5.firebasestorage.app",
  messagingSenderId: "1046519900605",
  appId: "1:1046519900605:web:5bf6c3240dedb10c9acad4",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
