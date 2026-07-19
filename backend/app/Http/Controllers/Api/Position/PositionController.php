<?php

namespace App\Http\Controllers\Api\Position;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PositionController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = \App\Models\Position::query();

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        $perPage = $request->integer('per_page', 10);
        $positions = $query->paginate($perPage);

        return $this->success($positions, 'Positions retrieved successfully.');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'description' => ['nullable', 'string'],
            'salary_range' => ['nullable', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $position = \App\Models\Position::create($validator->validated());

        return $this->created($position, 'Position created successfully.');
    }

    public function show(string $id)
    {
        $position = \App\Models\Position::find($id);

        if (! $position) {
            return $this->notFound('Position not found.');
        }

        return $this->success($position, 'Position retrieved successfully.');
    }

    public function update(Request $request, string $id)
    {
        $position = \App\Models\Position::find($id);

        if (! $position) {
            return $this->notFound('Position not found.');
        }

        $validator = Validator::make($request->all(), [
            'title' => ['sometimes', 'string', 'max:255'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'description' => ['nullable', 'string'],
            'salary_range' => ['nullable', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $position->update($validator->validated());

        return $this->success($position, 'Position updated successfully.');
    }

    public function destroy(string $id)
    {
        $position = \App\Models\Position::find($id);

        if (! $position) {
            return $this->notFound('Position not found.');
        }

        $position->delete();

        return $this->noContent();
    }
}
