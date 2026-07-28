import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CameraIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import type {
  CompanySettings,
  SettingsFormData,
} from "../../../types/settings.types";
import { settingsApi } from "../../../api/setting/settingsApi";

// Timezone options
const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
];

const dateFormats = [
  { value: "YYYY-MM-DD", label: "2024-01-15" },
  { value: "MM/DD/YYYY", label: "01/15/2024" },
  { value: "DD/MM/YYYY", label: "15/01/2024" },
  { value: "MMM DD, YYYY", label: "Jan 15, 2024" },
  { value: "DD MMM YYYY", label: "15 Jan 2024" },
];

const timeFormats = [
  { value: "HH:mm", label: "14:30" },
  { value: "hh:mm A", label: "02:30 PM" },
  { value: "HH:mm:ss", label: "14:30:00" },
];

const weekStartDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const defaultSettings: CompanySettings = {
  id: 0,
  company_name: "",
  company_code: "",
  company_email: "",
  company_phone: "",
  company_address: "",
  company_city: "",
  company_state: "",
  company_country: "",
  company_zip: "",
  company_website: "",
  company_logo: null,
  tax_id: "",
  registration_number: "",
  timezone: "UTC",
  date_format: "YYYY-MM-DD",
  time_format: "HH:mm",
  currency: "USD",
  currency_symbol: "$",
  fiscal_year_start: "",
  fiscal_year_end: "",
  week_start_day: "Monday",
  created_at: "",
  updated_at: "",
};

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [formData, setFormData] = useState<SettingsFormData>({
    company_name: "",
    company_code: "",
    company_email: "",
    company_phone: "",
    company_address: "",
    company_city: "",
    company_state: "",
    company_country: "",
    company_zip: "",
    company_website: "",
    tax_id: "",
    registration_number: "",
    timezone: "UTC",
    date_format: "YYYY-MM-DD",
    time_format: "HH:mm",
    currency: "USD",
    fiscal_year_start: "",
    fiscal_year_end: "",
    week_start_day: "Monday",
  });

  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await settingsApi.getSettings();
        setSettings(data);
        setFormData({
          company_name: data.company_name || "",
          company_code: data.company_code || "",
          company_email: data.company_email || "",
          company_phone: data.company_phone || "",
          company_address: data.company_address || "",
          company_city: data.company_city || "",
          company_state: data.company_state || "",
          company_country: data.company_country || "",
          company_zip: data.company_zip || "",
          company_website: data.company_website || "",
          tax_id: data.tax_id || "",
          registration_number: data.registration_number || "",
          timezone: data.timezone || "UTC",
          date_format: data.date_format || "YYYY-MM-DD",
          time_format: data.time_format || "HH:mm",
          currency: data.currency || "USD",
          fiscal_year_start: data.fiscal_year_start || "",
          fiscal_year_end: data.fiscal_year_end || "",
          week_start_day: data.week_start_day || "Monday",
        });
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, logo: "Please upload an image file" });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, logo: "Image size should be less than 2MB" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      setErrors({ ...errors, logo: "" });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.company_name.trim()) {
      newErrors.company_name = "Company name is required";
    }
    if (!formData.company_code.trim()) {
      newErrors.company_code = "Company code is required";
    }
    if (!formData.company_email.trim()) {
      newErrors.company_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.company_email)) {
      newErrors.company_email = "Invalid email address";
    }
    if (!formData.company_phone.trim()) {
      newErrors.company_phone = "Phone number is required";
    }
    if (!formData.timezone) {
      newErrors.timezone = "Timezone is required";
    }
    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      // If logo was uploaded, use FormData
      if (logoPreview && logoPreview !== settings.company_logo) {
        const formDataObj = new FormData();
        // Get the file from file input
        const fileInput = fileInputRef.current;
        if (fileInput?.files?.[0]) {
          formDataObj.append("logo", fileInput.files[0]);
        }

        // Append all other fields
        Object.entries(formData).forEach(([key, value]) => {
          formDataObj.append(key, value as string);
        });

        await settingsApi.updateSettings(formDataObj);
      } else {
        await settingsApi.updateSettingsJson(formData);
      }

      setSuccess("Settings updated successfully!");
      setIsEditing(false);

      // Refresh settings
      const updated = await settingsApi.getSettings();
      setSettings(updated);

      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.message || "Failed to update settings",
      });
    } finally {
      setSaving(false);
    }
  };

  const getCurrencySymbol = (code: string) => {
    return currencies.find((c) => c.code === code)?.symbol || "$";
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Company Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Manage your company information and preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-secondary-900 hover:text-black transition-colors"
            >
              <PencilSquareIcon className="h-5 w-5" />
              Edit Settings
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    company_name: settings.company_name,
                    company_code: settings.company_code,
                    company_email: settings.company_email,
                    company_phone: settings.company_phone,
                    company_address: settings.company_address,
                    company_city: settings.company_city,
                    company_state: settings.company_state,
                    company_country: settings.company_country,
                    company_zip: settings.company_zip,
                    company_website: settings.company_website,
                    tax_id: settings.tax_id,
                    registration_number: settings.registration_number,
                    timezone: settings.timezone,
                    date_format: settings.date_format,
                    time_format: settings.time_format,
                    currency: settings.currency,
                    fiscal_year_start: settings.fiscal_year_start,
                    fiscal_year_end: settings.fiscal_year_end,
                    week_start_day: settings.week_start_day,
                  });
                  setLogoPreview(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckBadgeIcon className="h-5 w-5" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 rounded-lg bg-green-50 p-3 border border-green-200 flex items-start gap-3">
          <CheckBadgeIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {errors.general && (
        <div className="mb-6 rounded-lg bg-red-50 p-3 border border-red-200 flex items-start gap-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {/* Company Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header with Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company Logo"
                    className="h-full w-full object-cover"
                  />
                ) : settings.company_logo ? (
                  <img
                    src={settings.company_logo}
                    alt="Company Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BuildingOfficeIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              {isEditing && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-1.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-lg"
                  >
                    <CameraIcon className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {isEditing ? (
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="text-xl font-bold text-gray-900 dark:text-gray-100 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primary-500 outline-none"
                    placeholder="Company Name"
                  />
                ) : (
                  settings.company_name
                )}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                {isEditing ? (
                  <input
                    type="text"
                    name="company_code"
                    value={formData.company_code}
                    onChange={handleChange}
                    className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primary-500 outline-none"
                    placeholder="Company Code"
                  />
                ) : (
                  `Code: ${settings.company_code}`
                )}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Last updated:{" "}
                {settings.updated_at
                  ? new Date(settings.updated_at).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Name *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                        errors.company_name
                          ? "border-red-300"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.company_name}
                    </p>
                  )}
                  {errors.company_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.company_name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Code *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company_code"
                      value={formData.company_code}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                        errors.company_code
                          ? "border-red-300"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.company_code}
                    </p>
                  )}
                  {errors.company_code && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.company_code}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <input
                        type="email"
                        name="company_email"
                        value={formData.company_email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                          errors.company_email
                            ? "border-red-300"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.company_email}
                    </p>
                  )}
                  {errors.company_email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.company_email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone *
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <input
                        type="tel"
                        name="company_phone"
                        value={formData.company_phone}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                          errors.company_phone
                            ? "border-red-300"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.company_phone}
                    </p>
                  )}
                  {errors.company_phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.company_phone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <GlobeAltIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <input
                        type="url"
                        name="company_website"
                        value={formData.company_website}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        placeholder="https://example.com"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.company_website || "N/A"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="company_address"
                      value={formData.company_address}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.company_address}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company_city"
                      value={formData.company_city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.company_city}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State/Province
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company_state"
                      value={formData.company_state}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.company_state}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company_country"
                      value={formData.company_country}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.company_country}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ZIP/Postal Code
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company_zip"
                      value={formData.company_zip}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.company_zip}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tax & Registration */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                Tax & Registration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tax ID
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="tax_id"
                      value={formData.tax_id}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.tax_id || "N/A"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Registration Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="registration_number"
                      value={formData.registration_number}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.registration_number || "N/A"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Localization */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <GlobeAltIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                Localization
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Timezone *
                  </label>
                  {isEditing ? (
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                        errors.timezone
                          ? "border-red-300"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {timezones.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.timezone}
                    </p>
                  )}
                  {errors.timezone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.timezone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Currency *
                  </label>
                  {isEditing ? (
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                        errors.currency
                          ? "border-red-300"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {currencies.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.symbol} - {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {getCurrencySymbol(settings.currency)} {settings.currency}
                    </p>
                  )}
                  {errors.currency && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.currency}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date Format
                  </label>
                  {isEditing ? (
                    <select
                      name="date_format"
                      value={formData.date_format}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      {dateFormats.map((df) => (
                        <option key={df.value} value={df.value}>
                          {df.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.date_format}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time Format
                  </label>
                  {isEditing ? (
                    <select
                      name="time_format"
                      value={formData.time_format}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      {timeFormats.map((tf) => (
                        <option key={tf.value} value={tf.value}>
                          {tf.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.time_format}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Week Start Day
                  </label>
                  {isEditing ? (
                    <select
                      name="week_start_day"
                      value={formData.week_start_day}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      {weekStartDays.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.week_start_day}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Fiscal Year */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                Fiscal Year
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fiscal Year Start
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="fiscal_year_start"
                      value={formData.fiscal_year_start}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.fiscal_year_start
                        ? new Date(
                            settings.fiscal_year_start,
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fiscal Year End
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="fiscal_year_end"
                      value={formData.fiscal_year_end}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {settings.fiscal_year_end
                        ? new Date(
                            settings.fiscal_year_end,
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* System Info */}
      <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              System Version
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              HRMS Pro v2.0.0
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Last Updated
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {settings.updated_at
                ? new Date(settings.updated_at).toLocaleString()
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Settings ID
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              #{settings.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
