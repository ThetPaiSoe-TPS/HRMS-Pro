export interface CompanySettings {
  id: number;
  company_name: string;
  company_code: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  company_city: string;
  company_state: string;
  company_country: string;
  company_zip: string;
  company_website: string;
  company_logo: string | null;
  tax_id: string;
  registration_number: string;
  timezone: string;
  date_format: string;
  time_format: string;
  currency: string;
  currency_symbol: string;
  fiscal_year_start: string;
  fiscal_year_end: string;
  week_start_day: string;
  created_at: string;
  updated_at: string;
}

export interface SettingsFormData {
  company_name: string;
  company_code: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  company_city: string;
  company_state: string;
  company_country: string;
  company_zip: string;
  company_website: string;
  tax_id: string;
  registration_number: string;
  timezone: string;
  date_format: string;
  time_format: string;
  currency: string;
  fiscal_year_start: string;
  fiscal_year_end: string;
  week_start_day: string;
}