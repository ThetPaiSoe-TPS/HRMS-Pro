<?php

namespace App\Http\Controllers\Api\Position;

use App\Http\Controllers\Controller;
use App\Models\Position;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PositionController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = Position::with(['department']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                    ->orWhere('code', 'like', '%' . $search . '%');
            });
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $perPage = $request->integer('per_page', 10);
        $positions = $query->paginate($perPage);

        // Add employees_count and salary_display to each position
        $positions->getCollection()->transform(function ($position) {
            $position->employees_count = $position->employees()->count();
            return $position;
        });

        return $this->success($positions, 'Positions retrieved successfully.');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:positions'],
            'department_id' => ['required', 'exists:departments,id'],
            'description' => ['nullable', 'string'],
            'salary_range' => ['nullable', 'string', 'max:100'],
            'min_salary' => ['nullable', 'numeric', 'min:0'],
            'max_salary' => ['nullable', 'numeric', 'min:0', 'gte:min_salary'],
            'status' => ['nullable', 'in:active,inactive'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $position = Position::create($validator->validated());
        $position->load(['department']);
        $position->employees_count = $position->employees()->count();

        return $this->created($position, 'Position created successfully.');
    }

    public function show(string $id)
    {
        $position = Position::with(['department'])->find($id);

        if (! $position) {
            return $this->notFound('Position not found.');
        }

        $position->employees_count = $position->employees()->count();

        return $this->success($position, 'Position retrieved successfully.');
    }

    public function update(Request $request, string $id)
    {
        $position = Position::find($id);

        if (! $position) {
            return $this->notFound('Position not found.');
        }

        $validator = Validator::make($request->all(), [
            'title' => ['sometimes', 'string', 'max:255'],
            'code' => ['sometimes', 'string', 'max:50', 'unique:positions,code,' . $id],
            'department_id' => ['sometimes', 'exists:departments,id'],
            'description' => ['nullable', 'string'],
            'salary_range' => ['nullable', 'string', 'max:100'],
            'min_salary' => ['nullable', 'numeric', 'min:0'],
            'max_salary' => ['nullable', 'numeric', 'min:0', 'gte:min_salary'],
            'status' => ['nullable', 'in:active,inactive'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $position->update($validator->validated());
        $position->load(['department']);
        $position->employees_count = $position->employees()->count();

        return $this->success($position, 'Position updated successfully.');
    }

    public function destroy(string $id)
    {
        $position = Position::find($id);

        if (! $position) {
            return $this->notFound('Position not found.');
        }

        // Check if position has employees
        if ($position->employees()->count() > 0) {
            return $this->error('Cannot delete position with assigned employees.', null, 422);
        }

        $position->delete();

        return $this->noContent();
    }
}
