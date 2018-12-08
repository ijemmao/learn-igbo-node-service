import * as admin from 'firebase-admin';
import serviceAccount from './../google';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://learn-igbo-1543470589176.firebaseio.com",
  storageBucket: "learn-igbo-1543470589176.appspot.com",
});

export default admin; 