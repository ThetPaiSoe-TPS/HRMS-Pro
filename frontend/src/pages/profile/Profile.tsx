import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  PencilSquareIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CalendarIcon,
  CameraIcon,
  KeyIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";
import type { Activity } from "../../types/activity.types";
import { activityApi } from "../../api/activityApi";

interface DepartmentOption {
  id: number;
  name: string;
  code?: string;
}

interface PositionOption {
  id: number;
  title: string;
  code?: string;
  department_id?: number;
}

// ============================================
// PROFILE PAGE
// ============================================
export const Profile: React.FC = () => {
  const { user, updateProfile, uploadAvatar } = useAuth();
  console.log("user:", user);

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user is employee
  const userRole =
    typeof user?.role === "string" ? user.role.toLowerCase() : "";
  const userRoleId = user?.role_id;
  const isEmployee = userRole === "employee" || userRoleId === 4;
  const isAdmin =
    userRole === "admin" ||
    userRole === "super_admin" ||
    userRoleId === 1 ||
    userRoleId === 2;

  // State for dropdowns (only used for admin/manager)
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [positions, setPositions] = useState<PositionOption[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  // State for profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: "",
    department_id: null as number | null,
    position: "",
    position_id: null as number | null,
    joinDate: user?.join_date || "",
    address: user?.address || "",
    bio: user?.bio || "",
    years_experience: user?.years_experience || 0,
    total_projects: user?.total_projects || 0,
  });

  // State for password change
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  // State for avatar
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      // Get department name from user object
      let departmentName = "";
      let departmentId = null;
      if (user.department) {
        if (typeof user.department === "object") {
          departmentName = (user.department as any)?.name || "";
          departmentId = (user.department as any)?.id || null;
        } else {
          departmentName = user.department || "";
        }
      }

      // Get position name from user object
      let positionName = "";
      let positionId = null;
      if (user.position) {
        if (typeof user.position === "object") {
          positionName =
            (user.position as any)?.title || (user.position as any)?.name || "";
          positionId = (user.position as any)?.id || null;
        } else {
          positionName = user.position || "";
        }
      }

      setProfileData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        department: departmentName,
        department_id: departmentId,
        position: positionName,
        position_id: positionId,
        joinDate: user?.join_date || "",
        address: user?.address || "",
        bio: user?.bio || "",
        years_experience: user?.years_experience || 0,
        total_projects: user?.total_projects || 0,
      });

      // If admin, fetch all departments and positions
      if (!isEmployee) {
        fetchAllDropdownData();
      }
    }
  }, [user]);

  // Fetch all departments and positions (admin/manager only)
  const fetchAllDropdownData = async () => {
    setLoadingDropdowns(true);

    try {
      // Try to fetch all departments
      try {
        const response = await api.get("/departments");
        const allDepts = response?.data || response || [];
        if (Array.isArray(allDepts) && allDepts.length > 0) {
          setDepartments(allDepts);
        }
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }

      // Try to fetch all positions
      try {
        const response = await api.get("/positions");
        const allPositions = response?.data || response || [];
        if (Array.isArray(allPositions) && allPositions.length > 0) {
          setPositions(allPositions);
        }
      } catch (error) {
        console.error("Failed to fetch positions:", error);
      }
    } catch (error) {
      console.error("Failed to fetch dropdown data:", error);
    } finally {
      setLoadingDropdowns(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);
      const data = await activityApi.getMyActivities(10);
      setActivities(data);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoadingActivities(false);
    }
  };

  const getActivityIcon = (color: string) => {
    const icons: Record<string, any> = {
      blue: UserCircleIcon,
      green: CheckBadgeIcon,
      yellow: ClockIcon,
      red: XMarkIcon,
      purple: BellIcon,
      gray: ClockIcon,
    };
    return icons[color] || ClockIcon;
  };

  const getActivityBgColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      yellow: "bg-yellow-100 text-yellow-600",
      red: "bg-red-100 text-red-600",
      purple: "bg-purple-100 text-purple-600",
      gray: "bg-gray-100 text-gray-600",
    };
    return colors[color] || "bg-gray-100 text-gray-600";
  };

  const handleProfileUpdate = async () => {
    try {
      const updateData: any = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        join_date: profileData.joinDate,
        address: profileData.address,
        bio: profileData.bio,
        years_experience: profileData.years_experience,
        total_projects: profileData.total_projects,
      };

      // Only send department/position if user is NOT an employee
      if (!isEmployee) {
        if (profileData.department_id) {
          updateData.department_id = profileData.department_id;
        }
        if (profileData.position_id) {
          updateData.position_id = profileData.position_id;
        }
      }

      console.log("Updating profile with:", updateData);
      await updateProfile(updateData);
      setIsEditing(false);

      // Refresh user data after update
      window.location.reload();
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { authApi } = await import("../../api/auth/authApi");
      await authApi.changePassword({
        current_password: passwordData.current_password,
        password: passwordData.new_password,
        password_confirmation: passwordData.new_password_confirmation,
      });
      setShowPasswordModal(false);
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      alert("Password changed successfully!");
    } catch (error: any) {
      console.error("Password change failed:", error);
      alert(error?.response?.data?.message || "Failed to change password");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      await uploadAvatar(file);
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      console.error("Avatar upload failed:", error);
    }
  };

  // Handle department change (only for non-employees)
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isEmployee) return;
    const selectedId = e.target.value ? parseInt(e.target.value) : null;
    const selectedDept = departments.find((d) => d.id === selectedId);
    setProfileData({
      ...profileData,
      department_id: selectedId,
      department: selectedDept?.name || "",
    });
  };

  // Handle position change (only for non-employees)
  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isEmployee) return;
    const selectedId = e.target.value ? parseInt(e.target.value) : null;
    const selectedPos = positions.find((p) => p.id === selectedId);
    setProfileData({
      ...profileData,
      position_id: selectedId,
      position: selectedPos?.title || "",
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your personal information and account settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg bg-primary-900 hover:bg-secondary-900 hover:text-black"
              >
                <PencilSquareIcon className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg dark:text-gray-300 hover:bg-gray-300"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleProfileUpdate}
                  className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
                >
                  <CheckBadgeIcon className="w-4 h-4" />
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ==========================================
              LEFT COLUMN - Profile Card & Avatar
              ========================================== */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block">
                  <div className="flex items-center justify-center w-24 h-24 mx-auto overflow-hidden rounded-full bg-primary-100">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    ) : user?.avatar ? (
                      <img
                        src={
                          user.avatar.startsWith("http")
                            ? user.avatar
                            : `http://localhost:8000${user.avatar}`
                        }
                        alt="Profile"
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-3xl font-medium text-primary-700">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute bottom-0 right-0 p-1.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-lg"
                  >
                    <CameraIcon className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>
                {/* Name & Role */}
                <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {user?.name || "User Name"}
                </h2>
                <p className="text-sm text-gray-500 capitalize dark:text-gray-400">
                  {(typeof user?.role === "object"
                    ? (user?.role as any)?.name
                    : user?.role) || "Employee"}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {user?.email || "No email"}
                </p>
                {/* Status Badge */}
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  Active
                </div>
                {user?.last_login_at && (
                  <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    Last login: {new Date(user.last_login_at).toLocaleString()}
                    {user?.last_login_ip && ` (IP: ${user.last_login_ip})`}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    {isEditing ? (
                      <div className="flex flex-col items-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={profileData.years_experience}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setProfileData({
                              ...profileData,
                              years_experience: value ? parseInt(value, 10) : 0,
                            });
                          }}
                          className="w-full text-2xl font-bold text-center text-gray-900 bg-transparent border-b-2 dark:text-gray-100 border-primary-500 focus:outline-none"
                          placeholder="0"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Years Experience
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {user?.years_experience || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Years Experience
                        </p>
                      </>
                    )}
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    {isEditing ? (
                      <div className="flex flex-col items-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={profileData.total_projects}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setProfileData({
                              ...profileData,
                              total_projects: value ? parseInt(value, 10) : 0,
                            });
                          }}
                          className="w-full text-2xl font-bold text-center text-gray-900 bg-transparent border-b-2 dark:text-gray-100 border-primary-500 focus:outline-none"
                          placeholder="0"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Projects
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {user?.total_projects || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Projects
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 mt-6 space-y-2 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-700 transition-colors rounded-lg dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <KeyIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  Change Password
                </button>
                <button className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-700 transition-colors rounded-lg dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <BellIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  Notification Settings
                </button>
              </div>
            </div>
          </div>

          {/* ==========================================
              RIGHT COLUMN - Profile Details
              ========================================== */}
          <div className="space-y-6 lg:col-span-2">
            {/* Personal Information */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {profileData.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {profileData.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {profileData.phone}
                    </p>
                  )}
                </div>

                {/* Department - Show as disabled input for employees, dropdown for admins */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Department
                  </label>
                  {isEditing ? (
                    isEmployee ? (
                      // For employees: show as disabled input
                      <input
                        type="text"
                        value={profileData.department || "Not assigned"}
                        disabled
                        className="w-full px-3 py-2 mt-1 text-gray-500 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      />
                    ) : (
                      // For admins: show as dropdown
                      <select
                        value={profileData.department_id || ""}
                        onChange={handleDepartmentChange}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                        disabled={loadingDropdowns}
                      >
                        <option value="">Select Department</option>
                        {loadingDropdowns ? (
                          <option value="" disabled>
                            Loading...
                          </option>
                        ) : departments.length > 0 ? (
                          departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No departments available
                          </option>
                        )}
                      </select>
                    )
                  ) : (
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {profileData.department || "Not assigned"}
                    </p>
                  )}
                  {isEmployee && isEditing && (
                    <p className="mt-1 text-xs text-blue-600">
                      <span className="inline-flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Department cannot be changed. Contact HR for updates.
                      </span>
                    </p>
                  )}
                </div>

                {/* Position - Show as disabled input for employees, dropdown for admins */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Position
                  </label>
                  {isEditing ? (
                    isEmployee ? (
                      // For employees: show as disabled input
                      <input
                        type="text"
                        value={profileData.position || "Not assigned"}
                        disabled
                        className="w-full px-3 py-2 mt-1 text-gray-500 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      />
                    ) : (
                      // For admins: show as dropdown
                      <select
                        value={profileData.position_id || ""}
                        onChange={handlePositionChange}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                        disabled={loadingDropdowns}
                      >
                        <option value="">Select Position</option>
                        {loadingDropdowns ? (
                          <option value="" disabled>
                            Loading...
                          </option>
                        ) : positions.length > 0 ? (
                          positions.map((pos) => (
                            <option key={pos.id} value={pos.id}>
                              {pos.title}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No positions available
                          </option>
                        )}
                      </select>
                    )
                  ) : (
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {profileData.position || "Not assigned"}
                    </p>
                  )}
                  {isEmployee && isEditing && (
                    <p className="mt-1 text-xs text-blue-600">
                      <span className="inline-flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Position cannot be changed. Contact HR for updates.
                      </span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Join Date
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profileData.joinDate}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          joinDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {formatDate(profileData.joinDate)}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {profileData.address || "Not set"}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {profileData.bio || "No bio provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Recent Activity
                </h3>
                <button
                  onClick={fetchActivities}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Refresh
                </button>
              </div>

              {loadingActivities ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
                </div>
              ) : activities.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No recent activities found
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity) => {
                    const Icon = getActivityIcon(activity.color);
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${getActivityBgColor(activity.color)}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          IP: {activity.ip}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          CHANGE PASSWORD MODAL
          ========================================== */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md p-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Change Password
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.current_password}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        current_password: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.new_password}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        new_password: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.new_password_confirmation}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        new_password_confirmation: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Confirm new password"
                  />
                </div>

                {/* Password Requirements */}
                <div className="p-3 space-y-1 text-xs text-gray-500 rounded-lg dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                  <p>Password must contain:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li
                      className={
                        passwordData.new_password.length >= 8
                          ? "text-green-600"
                          : ""
                      }
                    >
                      At least 8 characters
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(passwordData.new_password)
                          ? "text-green-600"
                          : ""
                      }
                    >
                      One uppercase letter
                    </li>
                    <li
                      className={
                        /[a-z]/.test(passwordData.new_password)
                          ? "text-green-600"
                          : ""
                      }
                    >
                      One lowercase letter
                    </li>
                    <li
                      className={
                        /[0-9]/.test(passwordData.new_password)
                          ? "text-green-600"
                          : ""
                      }
                    >
                      One number
                    </li>
                    <li
                      className={
                        /[^A-Za-z0-9]/.test(passwordData.new_password)
                          ? "text-green-600"
                          : ""
                      }
                    >
                      One special character
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Missing icon imports
const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

export default Profile;
