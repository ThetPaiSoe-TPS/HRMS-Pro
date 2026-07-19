<?php

namespace App\Http\Requests\Attendance;

use App\Models\Attendance;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->can('create', Attendance::class);
    }

    public function rules(): array
    {
        return [
            'employee_id' => ['required', 'exists:employees,id'],
            'check_in' => ['required', 'date'],
            'check_out' => ['nullable', 'date', 'after:check_in'],
            'status' => ['nullable', 'string'],
            'note' => ['nullable', 'string'],
        ];
    }
}
