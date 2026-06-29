"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Lock, Mail, Phone, User, LogOut } from "lucide-react";
import DashboardNav from "@/features/dashboard-nav/dashboard-nav";
import {
  useCurrentUser,
  useLogout,
  useChangePassword,
  useUpdateProfile, // ✅ UPDATED
} from "@/queries/auth";
import { toast } from "@/components/ui/sonner";

export default function SettingsPage() {
  const { data: user, isLoading } = useCurrentUser();
  const logoutMutation = useLogout();
  const changePasswordMutation = useChangePassword();
  const updateProfileMutation = useUpdateProfile();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError("");
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      },
      {
        onSuccess: () => {
          toast("Profile updated successfully");
        },
        onError: (err: any) => {
          toast(err?.message || "Failed to update profile");
        },
      },
    );
  };

  // ✅ FIXED CHANGE PASSWORD
  const handleChangePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    changePasswordMutation.mutate(
      {
        currentPassword,
        newPassword,
      },
      {
        onSuccess: () => {
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setPasswordError("");

          toast("Password changed successfully");
        },
        onError: (err: any) => {
          setPasswordError(err?.message || "Failed to update password");

          toast("Failed to update password");
        },
      },
    );
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast("You have been logged out successfully");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fbfbfb]">
        <DashboardNav />
        <div className="p-8 text-[#77777c]">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <DashboardNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 rounded-[32px] border border-[#f0eeee] bg-white p-8 shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
            Account
          </p>
          <h1 className="text-3xl font-black tracking-[-0.05em] text-[#171717] sm:text-5xl">
            Settings
          </h1>
          <p className="mt-3 text-[#77777c]">Manage your account and preferences</p>
        </div>

        <div className="mb-8 flex w-fit gap-2 rounded-full border border-[#f0eeee] bg-white p-1 shadow-[0_12px_30px_rgba(23,23,23,0.04)]">
          <button
            onClick={() => setActiveTab("profile")}
            className={`rounded-full px-5 py-3 font-black transition-colors ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] text-white"
                : "text-[#77777c] hover:text-[#ee1c25]"
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </div>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`rounded-full px-5 py-3 font-black transition-colors ${
              activeTab === "security"
                ? "bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] text-white"
                : "text-[#77777c] hover:text-[#ee1c25]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Security
            </div>
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="max-w-2xl rounded-[28px] border border-[#f0eeee] bg-white p-8 shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
            <h2 className="text-xl font-black text-[#171717] mb-6">
              Personal Information
            </h2>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="h-12 rounded-2xl bg-[#f7f7f8] border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57]"
                />
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="h-12 rounded-2xl bg-[#f7f7f8] border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57]"
                />
              </div>

              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                disabled
                className="h-12 rounded-2xl bg-[#f7f7f8] border-transparent"
              />

              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="h-12 rounded-2xl bg-[#f7f7f8] border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57]"
              />

              <Button
                onClick={handleSaveProfile}
                disabled={updateProfileMutation.isPending}
                className="h-12 rounded-full bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] hover:opacity-95 text-white w-full md:w-64 px-8 text-base font-black"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-8">
            {/* Change Password */}
            <div className="max-w-2xl rounded-[28px] border border-[#f0eeee] bg-white p-8 shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
              <h2 className="text-xl font-black text-[#171717] mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </h2>

              <div className="space-y-6">
                <Input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Current password"
                  className="h-12 rounded-2xl bg-[#f7f7f8] border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57]"
                />

                <Input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New password"
                  className="h-12 rounded-2xl bg-[#f7f7f8] border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57]"
                />

                <Input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm password"
                  className="h-12 rounded-2xl bg-[#f7f7f8] border-transparent focus-visible:ring-0 focus-visible:border-[#ff5a57]"
                />

                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}

                <Button
                  onClick={handleChangePassword}
                  disabled={changePasswordMutation.isPending}
                  className="h-12 rounded-full bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] hover:opacity-95 text-white md:w-64 w-full px-6 font-black"
                >
                  {changePasswordMutation.isPending
                    ? "Updating..."
                    : "Update Password"}
                </Button>
              </div>
            </div>

            {/* Logout */}
            <div className="max-w-2xl rounded-[28px] border border-[#f0eeee] bg-white p-8 shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
              <h2 className="text-xl font-black text-[#171717] mb-4">
                Session Management
              </h2>

              <p className="text-[#77777c] mb-6">Sign out from all devices</p>

              <Button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="h-12 rounded-full bg-linear-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] text-white flex items-center gap-2 md:w-64 w-full px-6 font-black shadow-[0_18px_38px_rgba(242,33,124,0.22)] hover:opacity-95"
              >
                <LogOut className="w-4 h-4" />
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Dialog */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="rounded-3xl border-[#f0eeee]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>

          <p className="text-[#77777c]">Are you sure you want to logout?</p>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
              className="md:w-45 rounded-full"
            >
              Cancel
            </Button>

            <Button
              onClick={confirmLogout}
              disabled={logoutMutation.isPending}
              className="bg-linear-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] text-white md:w-45 rounded-full font-black shadow-[0_18px_38px_rgba(242,33,124,0.22)] hover:opacity-95"
            >
              {logoutMutation.isPending ? "Logging out..." : "Yes, Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";

// import { Lock, Mail, Phone, User, LogOut, Shield, Save, AlertCircle } from "lucide-react";
// import DashboardNav from "@/features/dashboard-nav/dashboard-nav";
// import {
//   useCurrentUser,
//   useLogout,
//   useChangePassword,
// } from "@/queries/auth";
// import { toast } from "@/components/ui/sonner";

// export default function SettingsPage() {
//   const { data: user, isLoading } = useCurrentUser();
//   const logoutMutation = useLogout();
//   const changePasswordMutation = useChangePassword();

//   const [showLogoutModal, setShowLogoutModal] = useState(false);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//   });

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [passwordError, setPasswordError] = useState("");

//   const [activeTab, setActiveTab] = useState("profile");
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         email: user.email || "",
//         phone: user.phone || "",
//       });
//     }
//   }, [user]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setPasswordData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setPasswordError("");
//   };

//   const handleSaveProfile = async () => {
//     setIsSaving(true);
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     setIsSaving(false);

//     toast('Profile updated successfully');
//   };

//   const handleChangePassword = () => {
//     const { currentPassword, newPassword, confirmPassword } = passwordData;

//     if (!currentPassword || !newPassword || !confirmPassword) {
//       setPasswordError("All fields are required");
//       return;
//     }

//     if (currentPassword === newPassword) {
//       setPasswordError(
//         "New password must be different from current password"
//       );
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setPasswordError("Passwords do not match");
//       return;
//     }

//     changePasswordMutation.mutate(
//       {
//         currentPassword,
//         newPassword,
//       },
//       {
//         onSuccess: () => {
//           setPasswordData({
//             currentPassword: "",
//             newPassword: "",
//             confirmPassword: "",
//           });
//           setPasswordError("");

//           toast('Password changed successfully');
//         },
//         onError: (err: any) => {
//           setPasswordError(err?.message || "Failed to update password");

//           toast('Failed to update password');
//         },
//       }
//     );
//   };

//   const handleLogout = () => {
//     setShowLogoutModal(true);
//   };

//   const confirmLogout = () => {
//     logoutMutation.mutate(undefined, {
//       onSuccess: () => {
//         toast('You have been logged out successfully');
//       },
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <DashboardNav />
//         <div className="flex items-center justify-center p-8 h-96">
//           <p className="text-muted-foreground">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <DashboardNav />

//       <div className="max-w-5xl mx-auto px-4 sm:px-2 lg:px-4 py-8">
//         {/* Header Section */}
//         <div className="mb-12">
//           <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
//             Account Settings
//           </h1>
//           <p className="text-lg text-muted-foreground">
//             Manage your profile, security, and account preferences
//           </p>
//         </div>

//         {/* Tab Navigation - Modern Pill Style */}
//         <div className="flex gap-3 mb-8 bg-muted p-1 rounded-full w-fit">
//           <button
//             onClick={() => setActiveTab("profile")}
//             className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
//               activeTab === "profile"
//                 ? "bg-primary text-primary-foreground shadow-md"
//                 : "text-muted-foreground hover:text-foreground"
//             }`}
//           >
//             <User className="w-4 h-4" />
//             Profile
//           </button>

//           <button
//             onClick={() => setActiveTab("security")}
//             className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
//               activeTab === "security"
//                 ? "bg-primary text-primary-foreground shadow-md"
//                 : "text-muted-foreground hover:text-foreground"
//             }`}
//           >
//             <Shield className="w-4 h-4" />
//             Security
//           </button>
//         </div>

//         {/* Profile Tab */}
//         {activeTab === "profile" && (
//           <div className="space-y-6">
//             {/* Profile Card */}
//             <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
//               <div className="bg-linear-to-r from-primary/10 to-primary/5 px-4 py-4 border-b border-border">
//                 <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
//                     <User className="w-6 h-6" />
//                   Personal Information
//                 </h2>
//                 <p className="text-muted-foreground">
//                   Update your profile details and contact information
//                 </p>
//               </div>

//               <div className="p-8 space-y-8">
//                 {/* Name Fields */}
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-foreground">
//                       First Name
//                     </label>
//                     <Input
//                       type="text"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       placeholder="Enter your first name"
//                       className="h-11 bg-background border-border"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-foreground">
//                       Last Name
//                     </label>
//                     <Input
//                       type="text"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       placeholder="Enter your last name"
//                       className="h-11 bg-background border-border"
//                     />
//                   </div>
//                 </div>

//                 {/* Email Field */}
//                 <div className="space-y-2">
//                   <label className="flex text-sm font-medium text-foreground items-center gap-2">
//                     <Mail className="w-4 h-4" />
//                     Email Address
//                   </label>
//                   <Input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     disabled
//                     onChange={handleInputChange}
//                     placeholder="your.email@example.com"
//                     className="h-11 bg-background border-border"
//                   />
//                 </div>

//                 {/* Phone Field */}
//                 <div className="space-y-2">
//                   <label className="flex text-sm font-medium text-foreground items-center gap-2">
//                     <Phone className="w-4 h-4" />
//                     Phone Number
//                   </label>
//                   <Input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     placeholder="+1 (555) 000-0000"
//                     className="h-11 bg-background border-border"
//                   />
//                 </div>

//                 {/* Save Button */}
//                 <div className="pt-4 flex items-center gap-3">
//                   <Button
//                     onClick={handleSaveProfile}
//                     disabled={isSaving}
//                     className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 px-8 flex items-center gap-2 cursor-pointer"
//                   >
//                     <Save className="w-4 h-4" />
//                     {isSaving ? "Saving..." : "Save Changes"}
//                   </Button>
//                   <span className="text-sm text-muted-foreground">
//                     Changes are saved automatically
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Security Tab */}
//         {activeTab === "security" && (
//           <div className="space-y-6">
//             {/* Change Password Card */}
//             <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
//               <div className="bg-linear-to-r from-primary/10 to-primary/5 px-4 py-4 border-b border-border">
//                 <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
//                   <Lock className="w-6 h-6" />
//                   Change Password
//                 </h2>
//                 <p className="text-muted-foreground">
//                   Keep your account secure with a strong password
//                 </p>
//               </div>

//               <div className="p-8 space-y-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-foreground">
//                     Current Password
//                   </label>
//                   <Input
//                     type="password"
//                     name="currentPassword"
//                     value={passwordData.currentPassword}
//                     onChange={handlePasswordChange}
//                     placeholder="Enter your current password"
//                     className="h-11 bg-background border-border"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-foreground">
//                     New Password
//                   </label>
//                   <Input
//                     type="password"
//                     name="newPassword"
//                     value={passwordData.newPassword}
//                     onChange={handlePasswordChange}
//                     placeholder="Enter a new password"
//                     className="h-11 bg-background border-border"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-foreground">
//                     Confirm Password
//                   </label>
//                   <Input
//                     type="password"
//                     name="confirmPassword"
//                     value={passwordData.confirmPassword}
//                     onChange={handlePasswordChange}
//                     placeholder="Confirm your new password"
//                     className="h-11 bg-background border-border"
//                   />
//                 </div>

//                 {passwordError && (
//                   <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3">
//                     <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
//                     <p className="text-sm text-destructive">
//                       {passwordError}
//                     </p>
//                   </div>
//                 )}

//                 <Button
//                   onClick={handleChangePassword}
//                   disabled={changePasswordMutation.isPending}
//                   className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer font-semibold h-11 px-8 mt-6"
//                 >
//                   {changePasswordMutation.isPending
//                     ? "Updating..."
//                     : "Update Password"}
//                 </Button>
//               </div>
//             </div>

//             {/* Session Management Card */}
//             <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
//               <div className="bg-linear-to-r from-destructive/10 to-destructive/5 px-4 py-4 border-b border-border">
//                 <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
//                   <LogOut className="w-6 h-6" />
//                   Session Management
//                 </h2>
//                 <p className="text-muted-foreground">
//                   Sign out from your account on all devices
//                 </p>
//               </div>

//               <div className="p-8">
//                 <p className="text-sm text-muted-foreground mb-6">
//                   When you log out, you&apos;ll be signed out from all devices using your account. You&apos;ll need to log in again to access your account.
//                 </p>

//                 <Button
//                   onClick={handleLogout}
//                   disabled={logoutMutation.isPending}
//                   className="bg-primary hover:bg-destructive/90 font-semibold h-11 px-8 cursor-pointer  text-white flex items-center gap-2"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   {logoutMutation.isPending
//                     ? "Logging out..."
//                     : "Logout"}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Logout Dialog */}
//       <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="text-2xl">Confirm Logout</DialogTitle>
//           </DialogHeader>

//           <div className="py-4">
//             <p className="text-muted-foreground">
//               Are you sure you want to logout? You&apos;ll be signed out from all devices using your account.
//             </p>
//           </div>

//           <DialogFooter className="flex gap-3 sm:gap-2">
//             <Button
//               variant="outline"
//               onClick={() => setShowLogoutModal(false)}
//               className="flex-1 sm:flex-none bg-gray-400 h-10 md:w-45 cursor-pointer"
//             >
//               Cancel
//             </Button>

//             <Button
//               onClick={confirmLogout}
//               disabled={logoutMutation.isPending}
//               className="flex-1 sm:flex-none bg-primary border-primary text-white cursor-pointer md:w-45 "
//             >
//               {logoutMutation.isPending
//                 ? "Logging out..."
//                 : "Yes, Logout"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
