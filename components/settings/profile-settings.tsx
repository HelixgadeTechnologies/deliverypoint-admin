"use client";

import Button from "@/ui/button";
import CardComponent from "@/ui/card-wrapper";
import PasswordInput from "@/ui/forms/password-input";
import TextInput from "@/ui/forms/text-input";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/app/(app)/firebase/config";
import { onAuthStateChanged, signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";

interface SuperAdminData {
  email: string;
  fullName?: string;
  phoneNumber?: string;
  role: string;
  createdAt?: any;
  isActive?: boolean;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfileSettings() {
  const router = useRouter();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [superAdminData, setSuperAdminData] = useState<SuperAdminData>({
    email: "",
    fullName: "",
    phoneNumber: "",
    role: "super admin",
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Fetch current user and super admin data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchSuperAdminData(user.email!);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Function to fetch super admin data
  const fetchSuperAdminData = async (email: string) => {
    try {
      const superAdminRef = doc(db, "super_admins", email);
      const superAdminSnapshot = await getDoc(superAdminRef);

      if (superAdminSnapshot.exists()) {
        const data = superAdminSnapshot.data();
        setSuperAdminData({
          email: data.email || email,
          fullName: data.fullName || "",
          phoneNumber: data.phoneNumber || "",
          role: data.role || "super admin",
        });
      } else {
        // If no document exists, create one with basic data
        setSuperAdminData({
          email: email,
          fullName: "",
          phoneNumber: "",
          role: "super admin",
        });
      }
    } catch (error) {
      console.error("Error fetching super admin data:", error);
      toast.error("Failed to load profile data");
    }
  };

  // Function to update super admin profile
  const updateSuperAdminProfile = async (updatedData: Partial<SuperAdminData>) => {
    if (!currentUser?.email) {
      toast.error("No user logged in");
      return false;
    }

    setLoading(true);
    try {
      const superAdminRef = doc(db, "super_admins", currentUser.email);
      
      await updateDoc(superAdminRef, {
        ...updatedData,
        updatedAt: new Date(),
      });

      // Update local state
      setSuperAdminData(prev => ({
        ...prev,
        ...updatedData
      }));

      toast.success("Profile updated successfully!");
      return true;
    } catch (error: any) {
      console.error("Error updating super admin profile:", error);
      toast.error(error.message || "Failed to update profile");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to update password
  const updateUserPassword = async (passwordData: PasswordData) => {
    if (!currentUser) {
      toast.error("No user logged in");
      return false;
    }

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return false;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    setPasswordLoading(true);
    try {
      // Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update password
      await updatePassword(currentUser, passwordData.newPassword);
      
      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password updated successfully!");
      return true;
    } catch (error: any) {
      console.error("Error updating password:", error);
      
      // Handle specific error cases
      if (error.code === 'auth/wrong-password') {
        toast.error("Current password is incorrect");
      } else if (error.code === 'auth/requires-recent-login') {
        toast.error("Please log in again to update your password");
      } else {
        toast.error(error.message || "Failed to update password");
      }
      return false;
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle personal information update
  const handlePersonalInfoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedData = {
      fullName: superAdminData.fullName,
      phoneNumber: superAdminData.phoneNumber,
    };

    await updateSuperAdminProfile(updatedData);
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    await updateUserPassword(passwordData);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.clear();
      localStorage.clear();
      toast.success("Logged out successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Handle input changes for personal information
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSuperAdminData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input changes for password fields
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section className="space-y-6">
      <Toaster position="top-right" />
      
      <Heading
        heading="Profile Settings"
        subtitle="Manage your account settings and preferences"
      />

      <CardComponent bgColor="#FAFAFA">
        <Heading
          heading="Personal Information"
          subtitle="Update your personal details and profile picture"
          sm
        />

        <div className="flex flex-col md:flex-row gap-3 items-center my-6">
          <div className="size-14 rounded-full relative">
            <Image
              src="/placeholder.webp"
              alt="User"
              fill
              className="object-cover"
            />
            <div className="size-[23px] bg-[#0095DA] rounded-full flex justify-center items-center absolute right-0 bottom-0 p-1 cursor-pointer">
              <Icon
                icon={"material-symbols-light:add-a-photo-outline-sharp"}
                color="#FFF"
              />
            </div>
          </div>
          <div>
            <p className="text-[#1F1F1F] text-base text-center md:text-start">
              {superAdminData.fullName || "Super Admin"}
            </p>
            <p className="text-[#7C7979] text-base text-center md:text-start">
              {superAdminData.email}
            </p>
          </div>
          <div className="h-[22px] bg-[#0095DA] w-14 rounded-full flex justify-center items-center">
            <span className="text-[10px] text-[#FAFAFA]">Admin</span>
          </div>
        </div>

        {/* personal information */}
        <form onSubmit={handlePersonalInfoUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <TextInput
              value={superAdminData.fullName || ""}
              onChange={handleInputChange}
              placeholder="John Doe"
              label="Full Name"
              name="fullName"
            />
            <TextInput
              value={superAdminData.email}
              onChange={() => {}} // Email should not be editable in most cases
              placeholder="useradmin@gmail.com"
              label="Email Address"
              name="email"
            />
            <TextInput
              value={superAdminData.phoneNumber || ""}
              onChange={handleInputChange}
              placeholder="09034563454"
              label="Phone Number"
              name="phoneNumber"
            />
          </div>
          <div className="w-full md:w-[200px] mt-6">
            <Button 
              content={loading ? "Saving..." : "Save Changes"} 
              isDisabled={loading}
            />
          </div>
        </form>
      </CardComponent>

      <CardComponent bgColor="#FAFAFA">
        <Heading
          heading="Change Password"
          subtitle="Update your password to keep your account secure"
          sm
        />

        {/* change password */}
        <form onSubmit={handlePasswordUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <PasswordInput
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter Current Password"
              label="Current Password"
              name="currentPassword"
            />
            <div></div>
            <PasswordInput
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter New Password"
              label="New Password"
              name="newPassword"
            />
            <PasswordInput
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm New Password"
              label="Confirm New Password"
              name="confirmPassword"
            />
            <div className="w-full md:w-[200px]">
              <Button 
                content={passwordLoading ? "Updating..." : "Update Password"} 
                isDisabled={passwordLoading}
              />
            </div>
          </div>
        </form>
      </CardComponent>

      <CardComponent bgColor="#FAFAFA">
        <Heading
          heading="Account Security"
          subtitle="Manage your account security and access"
          sm
        />

        <div className="border border-[#E4E9EF] h-full md:h-[78px] w-full rounded-lg p-6 mt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap gap-3 items-center">
            <Icon icon={"streamline:logout-1"} color={"#FF4D4F"} />
            <div>
              <h4 className="text-[#1F1F1F] font-semibold text-base">
                Log Out of All Devices
              </h4>
              <p className="text-[#7C7979] text-sm">
                Sign out from all devices for security
              </p>
            </div>
          </div>
          <div className="w-full md:w-[120px] mt-4 md:mt-0">
            <Button
              content="Log Out All"
              isSecondary
              variant="error"
              onClick={() => setConfirmLogout(true)}
            />
          </div>
        </div>
      </CardComponent>

      <Modal isOpen={confirmLogout} onClose={() => setConfirmLogout(false)}>
        <div className="space-y-4">
          <div className="flex justify-center text-[#FF4D4F]">
            <Icon icon={"ep:warning"} width={70} height={70} />
          </div>
          <Heading
            heading="Log Out"
            subtitle="Are you sure you want to log out?"
            className="text-center justify-center"
          />

          <div className="flex gap-4 items-center my-4">
            <Button 
              content="Cancel" 
              isSecondary 
              variant="error" 
              onClick={() => setConfirmLogout(false)} 
            />
            <Button 
              content="Log Out" 
              variant="error" 
              onClick={handleLogout}
            />
          </div>
        </div>
      </Modal>
    </section>
  );
}