"use client";

import Button from "@/ui/button";
import EmailInput from "@/ui/forms/email-input";
import PasswordInput from "@/ui/forms/password-input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/(app)/firebase/config";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Helper function to safely access sessionStorage
const setSessionItem = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(key, value);
  }
};

export default function LoginComponent() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };
  
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  // Function to register super admin with Firebase Auth and create Firestore document
  // const registerSuperAdmin = async (email: string, password: string) => {
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //     const user = userCredential.user;

  //     const superAdminRef = doc(db, "super_admins", email);
  //     await setDoc(superAdminRef, {
  //       email: email,
  //       role: "super admin",
  //       isActive: true,
  //       uid: user.uid,
  //       createdAt: serverTimestamp(),
  //     });
  //     toast.success("Super admin account created successfully!");
  //     console.log("New super admin created:", email);
  //     return true;
  //   } catch (error: unknown) {
  //     const firebaseError = error as { code?: string };
  //     console.error("Error creating super admin:", error);
      
  //     if (firebaseError.code === 'auth/email-already-in-use') {
  //       try {
  //         const superAdminRef = doc(db, "super_admins", email);
  //         await setDoc(superAdminRef, {
  //           email: email,
  //           role: "super admin",
  //           createdAt: new Date(),
  //           isActive: true,
  //           uid: 'existing-user'
  //         });
  //         toast.success("Super admin profile created!");
  //         return true;
  //       } catch (e) {
  //         console.error("Failed to create super admin profile", e);
  //         toast.error("Failed to create super admin profile");
  //         return false;
  //       }
  //     }
      
  //     toast.error("Failed to create super admin account");
  //     return false;
  //   }
  // };

  // Function to check if super admin exists and create if needed
  // const checkAndCreateSuperAdmin = async (email: string, password: string) => {
  //   try {
  //     const superAdminRef = doc(db, "super_admins", email);
  //     const superAdminSnapshot = await getDoc(superAdminRef);

  //     if (!superAdminSnapshot.exists()) {
  //       return await registerSuperAdmin(email, password);
  //     } else {
  //       console.log("Super admin already exists:", email);
  //       toast.success("Account verified successfully!");
  //       return true;
  //     }
  //   } catch (error) {
  //     console.error("Error checking/creating super admin:", error);
  //     toast.error("Failed to verify super admin account");
  //     return false;
  //   }
  // };


// You never want to auto-create “super admin” users during login.
// Your current code is very dangerous because:

// If a user enters a wrong email → you create a super admin

// If a user enters a wrong password → you create a super admin

// If the user doesn't exist → you create a super admin

// Every failed login becomes a super admin 😭

  // const handleLogin = async (e: FormEvent) => {
  //   e.preventDefault();
    
  //   if (!loginData.email || !loginData.password) {
  //     toast.error("Please fill in all fields");
  //     return;
  //   }
    
  //   try {
  //     const res = await signInWithEmailAndPassword(loginData.email, loginData.password);
  //     console.log(res?.user);
      
  //     if (res?.user) {
  //       const superAdminReady = await checkAndCreateSuperAdmin(loginData.email, loginData.password);
        
  //       if (superAdminReady) {
  //         setSessionItem('user', 'true');
  //         setSessionItem('userEmail', loginData.email);
  //         setSessionItem('userRole', 'super admin');
          
  //         toast.success("Login successful!");
  //         setTimeout(() => {
  //           router.push("/dashboard");
  //         }, 1000);
  //       }
  //     } else {
  //       toast.error("Invalid email or password. Creating super admin account...");
        
  //       const superAdminCreated = await registerSuperAdmin(loginData.email, loginData.password);
        
  //       if (superAdminCreated) {
  //         const newLoginRes = await signInWithEmailAndPassword(loginData.email, loginData.password);
          
  //         if (newLoginRes?.user) {
  //           setSessionItem('user', 'true');
  //           setSessionItem('userEmail', loginData.email);
  //           setSessionItem('userRole', 'super admin');
            
  //           toast.success("Account created and login successful!");
  //           setTimeout(() => {
  //             router.push("/dashboard");
  //           }, 1000);
  //         }
  //       }
  //     }
  //   } catch (error: unknown) {
  //     const firebaseError = error as { code?: string; message?: string };
  //     console.error("Login error:", error);
      
  //     if (firebaseError.code === 'auth/invalid-credential' || firebaseError.code === 'auth/user-not-found') {
  //       toast.error("Account not found. Creating super admin account...");
        
  //       const superAdminCreated = await registerSuperAdmin(loginData.email, loginData.password);
        
  //       if (superAdminCreated) {
  //         try {
  //           const newLoginRes = await signInWithEmailAndPassword(loginData.email, loginData.password);
            
  //           if (newLoginRes?.user) {
  //             setSessionItem('user', 'true');
  //             setSessionItem('userEmail', loginData.email);
  //             setSessionItem('userRole', 'super admin');
              
  //             toast.success("Account created and login successful!");
  //             setTimeout(() => {
  //               router.push("/dashboard");
  //             }, 1000);
  //           }
  //         } catch (e) {
  //           console.error("Login after account creation failed:", e);
  //           toast.error("Account created but login failed. Please try again.");
  //         }
  //       }
  //     } else {
  //       toast.error(firebaseError.message || "Login failed");
  //     }
  //   }
  // };


// Let's fix everything properly.
  const handleLogin = async (e: FormEvent) => {
  e.preventDefault();

  if (!loginData.email || !loginData.password) {
    toast.error("Please fill in all fields");
    return;
  }

  try {
    // 1. Login with Firebase Auth
    const res = await signInWithEmailAndPassword(loginData.email, loginData.password);

    if (!res?.user) {
      toast.error("Login failed. Try again.");
      return;
    }

    // 2. Fetch user profile from Firestore
    const userRef = doc(db, "super_admins", loginData.email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      toast.error("You are not authorized, pleas contact a super admin.");
      return;
    }

    const userData = userSnap.data();
    
    // 3. Save session
    setSessionItem('user', 'true');
    setSessionItem('userEmail', loginData.email);
    setSessionItem('userRole', userData?.role);

    toast.success("Login successful!");

    // 4. Redirect
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);

  } catch (error: any) {
    console.error("Login error:", error);

    if (error.code === "auth/user-not-found") {
      toast.error("Account not found.");
    } else if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
      toast.error("Invalid email or password.");
    } else {
      toast.error(error.message || "Login failed");
    }
  }
};

  return (
    <section className="h-screen bg-[#0095DA] relative flex justify-center items-center">
      <Image
        src={"/tiles.svg"}
        alt="Background Image"
        fill
        className="object-cover"
      />

      <Image
        src={"/delivery-point-logo-white.svg"}
        alt="Delivery Point 2025"
        height={130}
        width={250}
        priority
        style={{ height: "auto", width: "auto" }}
        className="object-cover absolute top-[30px] left-[150px] hidden md:block"
      />

      <div className="h-screen md:h-fit w-full md:w-[480px] rounded-none md:rounded-3xl p-4 md:p-10 space-y-2.5 bg-white z-10 flex flex-col justify-center md:block">
        <h1 className="text-[#1F1F1F] font-extrabold text-2xl md:text-[32px] text-center leading-6">
          Welcome!
        </h1>
        <p className="text-[#7C7979] text-center text-sm md:text-base font-normal">
          Sign in to continue to dashboard
        </p>
        <form onSubmit={handleLogin} className="space-y-6">
          <EmailInput
            value={loginData.email}
            name="email"
            label="Email"
            onChange={handleInputChange}
          />
          <PasswordInput
            value={loginData.password}
            name="password"
            label="Password"
            onChange={handleInputChange}
          />
          <div className="flex justify-end items-center">
            <Link
              href={"/reset-password"}
              className="primary text-xs md:text-sm font-medium hover:underline whitespace-nowrap cursor-pointer"
            >
              Forgot Password?
            </Link>
          </div>
          <Button content="Sign In" />
        </form>
      </div>
      <Toaster position="top-center"/>
    </section>
  );
}