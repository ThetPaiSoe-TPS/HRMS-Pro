<?php

namespace App\Http\Controllers\Api\Attendance;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AttendanceController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = \App\Models\Attendance::query();

        if ($request->filled('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        if ($request->filled('date')) {
            $query->whereDate('check_in', $request->date);
        }

        $perPage = $request->integer('per_page', 10);
        $attendances = $query->orderBy('check_in', 'desc')->paginate($perPage);

        return $this->success($attendances, 'Attendances retrieved successfully.');
    }

    public function checkIn(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => ['required', 'exists:employees,id'],
            'check_in' => ['nullable', 'date_format:Y-m-d H:i:s'],
            'note' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $data = $validator->validated();
        $data['check_in'] = $data['check_in'] ?? now()->format('Y-m-d H:i:s');
        $data['status'] = 'present';

        $attendance = \App\Models\Attendance::create($data);

        return $this->created($attendance, 'Check-in recorded successfully.');
    }

    public function checkOut(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => ['required', 'exists:employees,id'],
            'check_out' => ['nullable', 'date'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $attendance = \App\Models\Attendance::where('employee_id', $request->employee_id)
            ->whereNull('check_out')
            ->latest('check_in')
            ->first();

        if (! $attendance) {
            return $this->notFound('No active check-in found.');
        }

        $attendance->update([
            'check_out' => $request->check_out ?? now(),
        ]);

        return $this->success($attendance, 'Check-out recorded successfully.');
    }

    public function show(string $id)
    {
        $attendance = \App\Models\Attendance::find($id);

        if (! $attendance) {
            return $this->notFound('Attendance not found.');
        }

        return $this->success($attendance, 'Attendance retrieved successfully.');
    }

    public function update(Request $request, string $id)
    {
        $attendance = \App\Models\Attendance::find($id);

        if (! $attendance) {
            return $this->notFound('Attendance not found.');
        }

        $validator = Validator::make($request->all(), [
            'check_in' => ['sometimes', 'date'],
            'check_out' => ['nullable', 'date'],
            'status' => ['sometimes', 'string'],
            'note' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $attendance->update($validator->validated());

        return $this->success($attendance, 'Attendance updated successfully.');
    }

    public function destroy(string $id)
    {
        $attendance = \App\Models\Attendance::find($id);

        if (! $attendance) {
            return $this->notFound('Attendance not found.');
        }

        $attendance->delete();

        return $this->noContent();
    }
}
