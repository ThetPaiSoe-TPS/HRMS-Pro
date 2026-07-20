<?php

namespace App\Http\Controllers\Api\Setting;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use App\Models\CompanySetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CompanySettingController extends Controller
{
    use ApiResponseTrait;

    public function show()
    {
        $setting = CompanySetting::first();

        if (! $setting) {
            return $this->notFound('Company settings not found.');
        }

        return $this->success($setting, 'Company settings retrieved successfully.');
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company_name' => ['sometimes', 'string', 'max:255'],
            'company_email' => ['sometimes', 'string', 'email', 'max:255'],
            'company_phone' => ['sometimes', 'string', 'max:50'],
            'company_address' => ['sometimes', 'string'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'], // File validation
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $data = $validator->validated();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $logo = $request->file('logo');
            $logoName = time() . '.' . $logo->getClientOriginalExtension();
            $logoPath = $logo->storeAs('company-logos', $logoName, 'public');
            $data['logo'] = $logoPath; // Store the path
        }

        $setting = CompanySetting::updateOrCreate(
            ['id' => 1],
            $data
        );

        return $this->success($setting, 'Company settings updated successfully.');
    }
}
