import api from "../axios";
import type {
  CompanySettings,
  SettingsFormData,
} from "../../types/settings.types";

const mapSettings = (data: any): CompanySettings => ({
  id: data.id,
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
  company_logo: data.company_logo || data.logo || null,
  tax_id: data.tax_id || "",
  registration_number: data.registration_number || "",
  timezone: data.timezone || "UTC",
  date_format: data.date_format || "YYYY-MM-DD",
  time_format: data.time_format || "HH:mm",
  currency: data.currency || "USD",
  currency_symbol: data.currency_symbol || "$",
  fiscal_year_start: data.fiscal_year_start || "",
  fiscal_year_end: data.fiscal_year_end || "",
  week_start_day: data.week_start_day || "Monday",
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const settingsApi = {
  // Get company settings
  getSettings: async (): Promise<CompanySettings> => {
    const response: any = await api.get("/settings/company");
    return mapSettings(response);
  },

  // Update company settings with file upload
  updateSettings: async (data: FormData): Promise<CompanySettings> => {
    const response: any = await api.put("/settings/company", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapSettings(response);
  },

  // Update company settings with JSON data (without file upload)
  updateSettingsJson: async (
    data: SettingsFormData,
  ): Promise<CompanySettings> => {
    const response: any = await api.put("/settings/company", data);
    return mapSettings(response);
  },
};
