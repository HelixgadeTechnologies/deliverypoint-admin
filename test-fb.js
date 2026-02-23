import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBL44BS7_mBk_aD56U1xWlFzoq7RUZ9CJg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "deleverypoint-fa171.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "deleverypoint-fa171",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "deleverypoint-fa171.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkVendorState() {
  const vendorsRef = collection(db, "vendors");
  const vendorsSnapshot = await getDocs(vendorsRef);
  
  if (vendorsSnapshot.empty) {
    console.log("No vendors found.");
    return;
  }
  
  const vendorData = vendorsSnapshot.docs.map(doc => doc.data());
  
  console.log(`Found ${vendorData.length} vendors`);
  
  vendorData.slice(0, 10).forEach((data, index) => {
    console.log(`\nVendor ${index + 1}: ${data.businessName || data.vendorName || "Unknown"}`);
    console.log(`Actual raw state string inside document object: '${data.state}'`);
    if (data.businessAddress) {
       console.log(`Has businessAddress map:`, typeof data.businessAddress === 'object' ? 'Yes' : 'No');
       if (typeof data.businessAddress === 'object') {
          console.log(`businessAddress.state:`, data.businessAddress.state);
       } else {
          console.log(`businessAddress string:`, data.businessAddress);
       }
    } else {
       console.log("No businessAddress property");
    }
  });
}

checkVendorState().catch(console.error);
