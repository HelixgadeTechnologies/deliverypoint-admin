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
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

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
  const registerSuperAdmin = async (email: string, password: string) => {
    try {
      // First create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Then create the super admin document in Firestore
      const superAdminRef = doc(db, "super_admins", email);
      await setDoc(superAdminRef, {
        email: email,
        role: "super admin",
        createdAt: new Date(),
        isActive: true,
        uid: user.uid // Store the Firebase Auth UID for reference
      });
      
      toast.success("Super admin account created successfully!");
      console.log("New super admin created:", email);
      return true;
    } catch (error: any) {
      console.error("Error creating super admin:", error);
      
      // If user already exists in auth but not in firestore, just create the firestore doc
      if (error.code === 'auth/email-already-in-use') {
        try {
          const superAdminRef = doc(db, "super_admins", email);
          await setDoc(superAdminRef, {
            email: email,
            role: "super admin",
            createdAt: new Date(),
            isActive: true,
            uid: 'existing-user' // Placeholder since we don't have the UID
          });
          toast.success("Super admin profile created!");
          return true;
        } catch (firestoreError) {
          toast.error("Failed to create super admin profile");
          return false;
        }
      }
      
      toast.error("Failed to create super admin account");
      return false;
    }
  };

  // Function to check if super admin exists and create if needed
  const checkAndCreateSuperAdmin = async (email: string, password: string) => {
    try {
      const superAdminRef = doc(db, "super_admins", email);
      const superAdminSnapshot = await getDoc(superAdminRef);

      if (!superAdminSnapshot.exists()) {
        // Super admin doesn't exist in Firestore, register them
        return await registerSuperAdmin(email, password);
      } else {
        console.log("Super admin already exists:", email);
        toast.success("Account verified successfully!")
        return true;
      }
    } catch (error: any) {
      console.error("Error checking/creating super admin:", error);
      toast.error("Failed to verify super admin account");
      return false;
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      // First attempt to login
      const res = await signInWithEmailAndPassword(loginData.email, loginData.password);
      console.log(res?.user)
      if (res?.user) {
        // Login successful, check if super admin exists and create if needed
        const superAdminReady = await checkAndCreateSuperAdmin(loginData.email, loginData.password);
        
        if (superAdminReady) {
          sessionStorage.setItem('user', 'true');
          sessionStorage.setItem('userEmail', loginData.email);
          sessionStorage.setItem('userRole', 'super admin');
          
          toast.success("Login successful!");
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        }
      } else {
        // Login failed, check if we need to create the account
        toast.error("Invalid email or password. Creating super admin account...");
        
        const superAdminCreated = await registerSuperAdmin(loginData.email, loginData.password);
        
        if (superAdminCreated) {
          // Now try to login with the newly created account
          const newLoginRes = await signInWithEmailAndPassword(loginData.email, loginData.password);
          
          if (newLoginRes?.user) {
            sessionStorage.setItem('user', 'true');
            sessionStorage.setItem('userEmail', loginData.email);
            sessionStorage.setItem('userRole', 'super admin');
            
            toast.success("Account created and login successful!");
            setTimeout(() => {
              router.push("/dashboard");
            }, 1000);
          }
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // If login fails due to user not found, try to create the account
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        toast.error("Account not found. Creating super admin account...");
        
        const superAdminCreated = await registerSuperAdmin(loginData.email, loginData.password);
        
        if (superAdminCreated) {
          // Now try to login with the newly created account
          try {
            const newLoginRes = await signInWithEmailAndPassword(loginData.email, loginData.password);
            
            if (newLoginRes?.user) {
              sessionStorage.setItem('user', 'true');
              sessionStorage.setItem('userEmail', loginData.email);
              sessionStorage.setItem('userRole', 'super admin');
              
              toast.success("Account created and login successful!");
              setTimeout(() => {
                router.push("/dashboard");
              }, 1000);
            }
          } catch (loginError) {
            toast.error("Account created but login failed. Please try again.");
          }
        }
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

      {/* logo image */}
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