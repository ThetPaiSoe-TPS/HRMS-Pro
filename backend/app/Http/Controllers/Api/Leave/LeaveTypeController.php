<?php

namespace App\Http\Controllers\Api\Leave;

use App\Http\Controllers\Controller;
use App\Models\LeaveType;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LeaveTypeController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = LeaveType::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('code', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $perPage = $request->integer('per_page', 10);
        $leaveTypes = $query->orderBy('name')->paginate($perPage);

        return $this->success($leaveTypes, 'Leave types retrieved successfully.');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'code' => ['required', 'string', 'max:50', 'unique:leave_types'],
            'description' => ['nullable', 'string'],
            'days_per_year' => ['required', 'integer', 'min:0'],
            'is_paid' => ['boolean'],
            'requires_approval' => ['boolean'],
            'max_consecutive_days' => ['nullable', 'integer', 'min:1'],
            'carry_forward' => ['boolean'],
            'carry_forward_limit' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'in:active,inactive'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $leaveType = LeaveType::create($validator->validated());

        return $this->created($leaveType, 'Leave type created successfully.');
    }

    public function show(string $id)
    {
        $leaveType = LeaveType::withCount(['leaveRequests as approved_count' => function ($query) {
            $query->where('status', 'approved');
        }])->find($id);

        if (!$leaveType) {
            return $this->notFound('Leave type not found.');
        }

        return $this->success($leaveType, 'Leave type retrieved successfully.');
    }

    public function update(Request $request, string $id)
    {
        $leaveType = LeaveType::find($id);

        if (!$leaveType) {
            return $this->notFound('Leave type not found.');
        }

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:100'],
            'code' => ['sometimes', 'string', 'max:50', 'unique:leave_types,code,' . $id],
            'description' => ['nullable', 'string'],
            'days_per_year' => ['sometimes', 'integer', 'min:0'],
            'is_paid' => ['boolean'],
            'requires_approval' => ['boolean'],
            'max_consecutive_days' => ['nullable', 'integer', 'min:1'],
            'carry_forward' => ['boolean'],
            'carry_forward_limit' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'in:active,inactive'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $leaveType->update($validator->validated());

        return $this->success($leaveType, 'Leave type updated successfully.');
    }

    public function destroy(string $id)
    {
        $leaveType = LeaveType::find($id);

        if (!$leaveType) {
            return $this->notFound('Leave type not found.');
        }

        // Check if leave type has any requests
        if ($leaveType->leaveRequests()->count() > 0) {
            return $this->error('Cannot delete leave type with existing leave requests.', null, 422);
        }

        $leaveType->delete();

        return $this->noContent();
    }

    public function getActiveTypes()
    {
        $leaveTypes = LeaveType::where('status', 'active')->get();
        return $this->success($leaveTypes, 'Active leave types retrieved successfully.');
    }
}
