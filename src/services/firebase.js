import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuração pública do projeto Firebase (a apiKey não é secreta no Firebase web —
// o acesso é controlado pelas regras do Firestore).
const firebaseConfig = {
  apiKey: 'AIzaSyCssda5zZeXiAwDK7kwHvNrimH-o9m5fG8',
  authDomain: 'pipoedu-d4b15.firebaseapp.com',
  projectId: 'pipoedu-d4b15',
  storageBucket: 'pipoedu-d4b15.firebasestorage.app',
  messagingSenderId: '923515076885',
  appId: '1:923515076885:web:8630397da8bc22cbeb691c',
  measurementId: 'G-EBD0108Y5V',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
