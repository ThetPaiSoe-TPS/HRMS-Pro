<?php

namespace App\Http\Controllers\Api\Attendance;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AttendanceController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = Attendance::with(['employee', 'employee.department', 'employee.position']);

        if ($request->filled('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('check_in', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('check_in', '<=', $request->date_to);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $perPage = $request->integer('per_page', 10);
        $attendances = $query->orderBy('check_in', 'desc')->paginate($perPage);

        // Transform the data to include photo in employee
        $attendances->getCollection()->transform(function ($attendance) {
            if ($attendance->employee) {
                $attendance->employee->photo = $attendance->employee->photo;
            }
            return $attendance;
        });

        return $this->success($attendances, 'Attendances retrieved successfully.');
    }

    public function checkIn(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => ['required', 'exists:employees,id'],
            'location_in' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        // Check if already checked in today
        $today = now()->format('Y-m-d');
        $existing = Attendance::where('employee_id', $request->employee_id)
            ->whereDate('check_in', $today)
            ->whereNull('check_out')
            ->first();

        if ($existing) {
            return $this->error('You are already checked in today.', null, 422);
        }

        $data = $validator->validated();
        $data['check_in'] = now();
        $data['status'] = 'present';

        // Check if check-in is late (after 9:15 AM)
        $checkInTime = now();
        $lateThreshold = now()->setTime(9, 15, 0);
        if ($checkInTime->gt($lateThreshold)) {
            $data['status'] = 'late';
        }

        $attendance = Attendance::create($data);
        $attendance->load(['employee', 'employee.department', 'employee.position']);

        return $this->created($attendance, 'Check-in recorded successfully.');
    }

    public function checkOut(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => ['required', 'exists:employees,id'],
            'location_out' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $attendance = Attendance::where('employee_id', $request->employee_id)
            ->whereNull('check_out')
            ->latest('check_in')
            ->first();

        if (! $attendance) {
            return $this->notFound('No active check-in found.');
        }

        $attendance->update([
            'check_out' => now(),
            'location_out' => $request->location_out,
            'note' => $request->note ?? $attendance->note,
        ]);

        $attendance->load(['employee', 'employee.department', 'employee.position']);

        return $this->success($attendance, 'Check-out recorded successfully.');
    }

    public function show(string $id)
    {
        $attendance = Attendance::with(['employee', 'employee.department', 'employee.position'])->find($id);

        if (! $attendance) {
            return $this->notFound('Attendance not found.');
        }

        return $this->success($attendance, 'Attendance retrieved successfully.');
    }

    public function update(Request $request, string $id)
    {
        $attendance = Attendance::find($id);

        if (! $attendance) {
            return $this->notFound('Attendance not found.');
        }

        $validator = Validator::make($request->all(), [
            'check_in' => ['sometimes', 'date_format:Y-m-d H:i:s'],
            'check_out' => ['nullable', 'date_format:Y-m-d H:i:s'],
            'status' => ['sometimes', 'string', 'in:present,absent,late,half_day,leave'],
            'note' => ['nullable', 'string'],
            'location_in' => ['nullable', 'string', 'max:255'],
            'location_out' => ['nullable', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $attendance->update($validator->validated());
        $attendance->load(['employee', 'employee.department', 'employee.position']);

        return $this->success($attendance, 'Attendance updated successfully.');
    }

    public function destroy(string $id)
    {
        $attendance = Attendance::find($id);

        if (! $attendance) {
            return $this->notFound('Attendance not found.');
        }

        $attendance->delete();

        return $this->noContent();
    }

    public function summary(Request $request)
    {
        $date = $request->date ?? now()->format('Y-m-d');

        $totalEmployees = Employee::count();

        $present = Attendance::whereDate('check_in', $date)->count();
        $absent = $totalEmployees - $present;

        $late = Attendance::whereDate('check_in', $date)
            ->where('status', 'late')
            ->count();

        $halfDay = Attendance::whereDate('check_in', $date)
            ->where('status', 'half_day')
            ->count();

        $onLeave = Attendance::whereDate('check_in', $date)
            ->where('status', 'leave')
            ->count();

        return $this->success([
            'total_employees' => $totalEmployees,
            'present' => $present,
            'absent' => $absent,
            'late' => $late,
            'half_day' => $halfDay,
            'on_leave' => $onLeave,
            'present_percentage' => $totalEmployees > 0 ? round(($present / $totalEmployees) * 100) : 0,
            'date' => $date,
        ], 'Attendance summary retrieved successfully.');
    }
}
