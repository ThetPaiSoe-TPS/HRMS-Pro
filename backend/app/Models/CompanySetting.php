<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'company_code',
        'company_email',
        'company_phone',
        'company_address',
        'company_city',
        'company_state',
        'company_country',
        'company_zip',
        'company_website',
        'company_logo',
        'logo',
        'tax_id',
        'registration_number',
        'timezone',
        'date_format',
        'time_format',
        'currency',
        'currency_symbol',
        'fiscal_year_start',
        'fiscal_year_end',
        'week_start_day',
    ];

    protected $casts = [
        'fiscal_year_start' => 'date',
        'fiscal_year_end' => 'date',
    ];

    // Get logo URL
    public function getLogoUrlAttribute()
    {
        if ($this->company_logo) {
            return asset('storage/' . $this->company_logo);
        }
        if ($this->logo) {
            return asset('storage/' . $this->logo);
        }
        return null;
    }
}
