<?php

namespace App\Http\Controllers\Api\Leave;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LeaveController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = \App\Models\LeaveRequest::query();

        if ($request->filled('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where('reason', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->integer('per_page', 10);
        $leaves = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return $this->success($leaves, 'Leave requests retrieved successfully.');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => ['required', 'exists:employees,id'],
            'leave_type' => ['required', 'string', 'max:100'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $data = $validator->validated();
        $data['status'] = 'pending';

        $leave = \App\Models\LeaveRequest::create($data);

        return $this->created($leave, 'Leave request created successfully.');
    }

    public function show(string $id)
    {
        $leave = \App\Models\LeaveRequest::find($id);

        if (! $leave) {
            return $this->notFound('Leave request not found.');
        }

        return $this->success($leave, 'Leave request retrieved successfully.');
    }

    public function update(Request $request, string $id)
    {
        $leave = \App\Models\LeaveRequest::find($id);

        if (! $leave) {
            return $this->notFound('Leave request not found.');
        }

        $validator = Validator::make($request->all(), [
            'leave_type' => ['sometimes', 'string', 'max:100'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string'],
            'status' => ['sometimes', 'string', 'in:pending,approved,rejected'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $leave->update($validator->validated());

        return $this->success($leave, 'Leave request updated successfully.');
    }

    public function destroy(string $id)
    {
        $leave = \App\Models\LeaveRequest::find($id);

        if (! $leave) {
            return $this->notFound('Leave request not found.');
        }

        $leave->delete();

        return $this->noContent();
    }

    public function approve(Request $request, string $id)
    {
        $leave = \App\Models\LeaveRequest::find($id);

        if (! $leave) {
            return $this->notFound('Leave request not found.');
        }

        $leave->update(['status' => 'approved']);

        return $this->success($leave, 'Leave request approved.');
    }

    public function reject(Request $request, string $id)
    {
        $leave = \App\Models\LeaveRequest::find($id);

        if (! $leave) {
            return $this->notFound('Leave request not found.');
        }

        $leave->update(['status' => 'rejected']);

        return $this->success($leave, 'Leave request rejected.');
    }

    public function uploadAttachment(Request $request, string $id)
    {
        $leave = \App\Models\LeaveRequest::find($id);

        if (! $leave) {
            return $this->notFound('Leave request not found.');
        }

        $request->validate([
            'attachment' => ['required', 'file', 'max:5120'],
        ]);

        $path = $request->file('attachment')->store('leave', 'public');
        $leave->update(['attachment' => $path]);

        return $this->success(['attachment' => $path], 'Attachment uploaded successfully.');
    }
}
