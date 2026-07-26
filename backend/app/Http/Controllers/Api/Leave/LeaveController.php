<?php

namespace App\Http\Controllers\Api\Leave;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Traits\ApiResponseTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class LeaveController extends Controller
{
    use ApiResponseTrait;

    protected function getEmployeeId(Request $request)
    {
        if ($request->user() && $request->user()->employee) {
            return $request->user()->employee->id;
        }
        return null;
    }

    protected function isEmployee(Request $request)
    {
        return $request->user() && $request->user()->role && $request->user()->role->slug === 'employee';
    }

    public function index(Request $request)
    {
        $query = LeaveRequest::with([
            'employee',
            'employee.department',
            'employee.position',
            'leaveType',
            'approver'
        ]);

        if ($this->isEmployee($request)) {
            $employeeId = $this->getEmployeeId($request);
            if (!$employeeId) {
                return $this->error('No employee record found.', 404);
            }
            $query->where('employee_id', $employeeId);
        } elseif ($request->filled('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('leave_type_id')) {
            $query->where('leave_type_id', $request->leave_type_id);
        }

        if ($request->filled('date_from')) {
            $query->where('start_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('end_date', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reason', 'like', '%' . $search . '%')
                    ->orWhereHas('employee', function ($q) use ($search) {
                        $q->where('name', 'like', '%' . $search . '%')
                            ->orWhere('employee_code', 'like', '%' . $search . '%');
                    });
            });
        }

        $perPage = $request->integer('per_page', 10);
        $leaves = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return $this->success($leaves, 'Leave requests retrieved successfully.');
    }

    public function store(Request $request)
    {
        $employeeId = $this->getEmployeeId($request);
        if (!$employeeId) {
            return $this->error('No employee record found. Please contact HR.', 404);
        }

        $validator = Validator::make($request->all(), [
            'leave_type_id' => ['required', 'exists:leave_types,id'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $data = $validator->validated();
        $data['employee_id'] = $employeeId;
        $data['status'] = 'pending';
        $data['total_days'] = Carbon::parse($data['start_date'])->diffInDays(Carbon::parse($data['end_date'])) + 1;

        // Check leave balance
        $leaveType = LeaveType::find($data['leave_type_id']);
        if ($leaveType) {
            $usedDays = LeaveRequest::where('employee_id', $employeeId)
                ->where('leave_type_id', $data['leave_type_id'])
                ->where('status', 'approved')
                ->sum('total_days');

            $availableDays = $leaveType->days_per_year - $usedDays;
            if ($data['total_days'] > $availableDays && $leaveType->days_per_year > 0) {
                return $this->error('Insufficient leave balance. Available: ' . $availableDays . ' days, Requested: ' . $data['total_days'] . ' days.', null, 422);
            }
        }

        $leave = LeaveRequest::create($data);
        $leave->load(['employee', 'employee.department', 'employee.position', 'leaveType']);

        return $this->created($leave, 'Leave request created successfully.');
    }

    public function show(string $id)
    {
        $leave = LeaveRequest::with([
            'employee',
            'employee.department',
            'employee.position',
            'leaveType',
            'approver'
        ])->find($id);

        if (!$leave) {
            return $this->notFound('Leave request not found.');
        }

        return $this->success($leave, 'Leave request retrieved successfully.');
    }

    public function update(Request $request, string $id)
    {
        $leave = LeaveRequest::find($id);

        if (!$leave) {
            return $this->notFound('Leave request not found.');
        }

        if ($leave->status !== 'pending') {
            return $this->error('Only pending requests can be updated.', null, 422);
        }

        $validator = Validator::make($request->all(), [
            'leave_type_id' => ['sometimes', 'exists:leave_types,id'],
            'start_date' => ['sometimes', 'date', 'after_or_equal:today'],
            'end_date' => ['sometimes', 'date', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $data = $validator->validated();
        if (isset($data['start_date']) && isset($data['end_date'])) {
            $data['total_days'] = Carbon::parse($data['start_date'])->diffInDays(Carbon::parse($data['end_date'])) + 1;
        }

        $leave->update($data);
        $leave->load(['employee', 'employee.department', 'employee.position', 'leaveType']);

        return $this->success($leave, 'Leave request updated successfully.');
    }

    public function destroy(string $id)
    {
        $leave = LeaveRequest::find($id);

        if (!$leave) {
            return $this->notFound('Leave request not found.');
        }

        if ($leave->status !== 'pending') {
            return $this->error('Only pending requests can be deleted.', null, 422);
        }

        if ($leave->attachment) {
            Storage::disk('public')->delete($leave->attachment);
        }

        $leave->delete();

        return $this->noContent();
    }

    public function approve(Request $request, string $id)
    {
        $leave = LeaveRequest::find($id);

        if (!$leave) {
            return $this->notFound('Leave request not found.');
        }

        if ($leave->status !== 'pending') {
            return $this->error('Only pending requests can be approved.', null, 422);
        }

        $leave->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $request->user()->id,
        ]);

        $leave->load(['employee', 'employee.department', 'employee.position', 'leaveType', 'approver']);

        return $this->success($leave, 'Leave request approved successfully.');
    }

    public function reject(Request $request, string $id)
    {
        $leave = LeaveRequest::find($id);

        if (!$leave) {
            return $this->notFound('Leave request not found.');
        }

        if ($leave->status !== 'pending') {
            return $this->error('Only pending requests can be rejected.', null, 422);
        }

        $validator = Validator::make($request->all(), [
            'rejection_reason' => ['nullable', 'string', 'max:500'],
        ]);

        $data = $validator->validated();

        $leave->update([
            'status' => 'rejected',
            'rejection_reason' => $data['rejection_reason'] ?? null,
        ]);

        $leave->load(['employee', 'employee.department', 'employee.position', 'leaveType']);

        return $this->success($leave, 'Leave request rejected successfully.');
    }

    public function uploadAttachment(Request $request, string $id)
    {
        $leave = LeaveRequest::find($id);

        if (!$leave) {
            return $this->notFound('Leave request not found.');
        }

        $request->validate([
            'attachment' => ['required', 'file', 'max:5120', 'mimes:pdf,doc,docx,jpg,jpeg,png'],
        ]);

        $file = $request->file('attachment');
        $path = $file->store('leave_attachments', 'public');

        $leave->update([
            'attachment' => $path,
            'attachment_original_name' => $file->getClientOriginalName(),
            'attachment_mime_type' => $file->getMimeType(),
            'attachment_size' => $file->getSize(),
        ]);

        return $this->success([
            'attachment_url' => $leave->attachment_url,
            'attachment' => $path,
        ], 'Attachment uploaded successfully.');
    }

    public function getBalance(Request $request)
    {
        $employeeId = $this->getEmployeeId($request);
        if (!$employeeId) {
            return $this->error('No employee record found.', 404);
        }

        $leaveTypes = LeaveType::where('status', 'active')->get();
        $balance = [];

        foreach ($leaveTypes as $type) {
            $used = LeaveRequest::where('employee_id', $employeeId)
                ->where('leave_type_id', $type->id)
                ->where('status', 'approved')
                ->sum('total_days');

            $pending = LeaveRequest::where('employee_id', $employeeId)
                ->where('leave_type_id', $type->id)
                ->where('status', 'pending')
                ->sum('total_days');

            $balance[] = [
                'leave_type_id' => $type->id,
                'leave_type_name' => $type->name,
                'total' => $type->days_per_year,
                'used' => $used,
                'pending' => $pending,
                'available' => max(0, $type->days_per_year - $used),
                'carry_forward' => 0,
            ];
        }

        return $this->success($balance, 'Leave balance retrieved successfully.');
    }
}
