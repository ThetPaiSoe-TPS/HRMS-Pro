<?php

namespace App\Http\Controllers\Api\Announcement;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\AnnouncementAttachment;
use App\Models\AnnouncementView;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AnnouncementController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = Announcement::with(['creator', 'attachments']);

        // ✅ If user is admin or has manage permission, show ALL
        $isAdmin = $request->user()->hasPermission('announcement.manage') ||
            $request->user()->role === 'super_admin';

        if (!$isAdmin) {
            // ✅ For regular users: only show published & targeted
            $query->where('status', 'published');

            // ✅ Target audience filter
            $query->where(function ($q) use ($request) {
                $q->where('target_type', 'all')
                    ->orWhere(function ($q) use ($request) {
                        $q->where('target_type', 'department')
                            ->where('target_id', $request->user()->employee?->department_id);
                    })
                    ->orWhere(function ($q) use ($request) {
                        $q->where('target_type', 'role')
                            ->where('target_id', $request->user()->role_id);
                    });
            });
        }

        // ✅ For admin: show ALL announcements (including drafts)
        if ($isAdmin) {
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }
            // If no status filter, show all
        }

        // ✅ Optional: Filter by date range (only if dates are provided)
        // Remove the automatic date filtering from the query

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->orWhere('summary', 'like', "%{$search}%");
            });
        }

        if ($request->boolean('pinned')) {
            $query->where('is_pinned', true);
        }

        if ($request->boolean('important')) {
            $query->where('is_important', true);
        }

        $perPage = $request->integer('per_page', 10);
        $announcements = $query->orderBy('is_pinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return $this->success($announcements, 'Announcements retrieved successfully.');
    }

    public function store(Request $request)
    {
        // ✅ 1. Convert empty strings to null for nullable fields
        $input = $request->all();
        $nullableFields = ['start_date', 'end_date', 'summary', 'target_id'];
        foreach ($nullableFields as $field) {
            if (isset($input[$field]) && $input[$field] === '') {
                $input[$field] = null;
            }
        }

        // ✅ 2. Debug: Log what's being received
        Log::info('Announcement Creation Request', [
            'input' => $input,
            'files' => $request->allFiles(),
            'user' => $request->user() ? $request->user()->id : null,
        ]);

        // ✅ 3. Make sure status has a default value
        if (!isset($input['status']) || empty($input['status'])) {
            $input['status'] = 'draft';
        }

        // ✅ 4. Make sure type has a default value
        if (!isset($input['type']) || empty($input['type'])) {
            $input['type'] = 'general';
        }

        // ✅ 5. Make sure priority has a default value
        if (!isset($input['priority']) || empty($input['priority'])) {
            $input['priority'] = 'medium';
        }

        // ✅ 6. Make sure target_type has a default value
        if (!isset($input['target_type']) || empty($input['target_type'])) {
            $input['target_type'] = 'all';
        }

        // ✅ 7. Merge input with files for validation
        $validator = Validator::make(array_merge($input, $request->allFiles()), [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'summary' => ['nullable', 'string', 'max:500'],
            'type' => ['required', 'string', 'in:general,hr,payroll,event,policy,emergency'],
            'priority' => ['required', 'string', 'in:low,medium,high,urgent'],
            'is_pinned' => ['nullable', 'boolean'],
            'is_important' => ['nullable', 'boolean'],
            'target_type' => ['required', 'string', 'in:all,department,role,specific'],
            'target_id' => ['nullable', 'integer', 'exists:departments,id'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
            'status' => ['required', 'string', 'in:draft,published,archived'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => ['file', 'max:10240'], // 10MB max
        ]);

        if ($validator->fails()) {
            // ✅ 8. Log validation errors for debugging
            Log::error('Announcement Validation Failed', [
                'errors' => $validator->errors()->toArray(),
                'input' => $input,
            ]);

            return $this->validationError($validator->errors());
        }

        $data = $validator->validated();

        // ✅ 9. Ensure boolean fields are properly cast
        $data['is_pinned'] = $data['is_pinned'] ?? false;
        $data['is_important'] = $data['is_important'] ?? false;
        $data['created_by'] = $request->user()->id;

        if ($data['status'] === 'published') {
            $data['published_at'] = now();
        }

        $announcement = Announcement::create($data);

        // ✅ 10. Handle attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('announcements', 'public');
                AnnouncementAttachment::create([
                    'announcement_id' => $announcement->id,
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ]);
            }
        }

        $announcement->load(['creator', 'attachments']);

        return $this->created($announcement, 'Announcement created successfully.');
    }

    public function show(Request $request, $id)
    {
        $announcement = Announcement::with(['creator', 'attachments', 'views'])->find($id);

        if (!$announcement) {
            return $this->notFound('Announcement not found.');
        }

        // Mark as viewed by current user
        if ($request->user()) {
            AnnouncementView::firstOrCreate([
                'announcement_id' => $announcement->id,
                'user_id' => $request->user()->id,
            ], [
                'viewed_at' => now(),
            ]);
        }

        return $this->success($announcement, 'Announcement retrieved successfully.');
    }

    public function update(Request $request, $id)
    {
        $announcement = Announcement::find($id);

        if (!$announcement) {
            return $this->notFound('Announcement not found.');
        }

        // Only allow editing if not published or archived
        if ($announcement->status === 'published' || $announcement->status === 'archived') {
            return $this->error('Published or archived announcements cannot be edited.', 422);
        }

        $validator = Validator::make($request->all(), [
            'title' => ['sometimes', 'string', 'max:255'],
            'content' => ['sometimes', 'string'],
            'summary' => ['nullable', 'string', 'max:500'],
            'type' => ['sometimes', 'in:general,hr,payroll,event,policy,emergency'],
            'priority' => ['sometimes', 'in:low,medium,high,urgent'],
            'is_pinned' => ['boolean'],
            'is_important' => ['boolean'],
            'target_type' => ['sometimes', 'in:all,department,role,specific'],
            'target_id' => ['nullable', 'integer'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
            'status' => ['sometimes', 'in:draft,published,archived'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $data = $validator->validated();

        if (isset($data['status']) && $data['status'] === 'published' && $announcement->status !== 'published') {
            $data['published_at'] = now();
        }

        $announcement->update($data);
        $announcement->load(['creator', 'attachments']);

        return $this->success($announcement, 'Announcement updated successfully.');
    }

    public function destroy($id)
    {
        $announcement = Announcement::find($id);

        if (!$announcement) {
            return $this->notFound('Announcement not found.');
        }

        // Delete attachments
        foreach ($announcement->attachments as $attachment) {
            Storage::disk('public')->delete($attachment->file_path);
            $attachment->delete();
        }

        $announcement->delete();

        return $this->noContent();
    }

    public function publish($id)
    {
        $announcement = Announcement::find($id);

        if (!$announcement) {
            return $this->notFound('Announcement not found.');
        }

        if ($announcement->status === 'published') {
            return $this->error('Announcement is already published.', 422);
        }

        $announcement->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        return $this->success($announcement, 'Announcement published successfully.');
    }

    public function archive($id)
    {
        $announcement = Announcement::find($id);

        if (!$announcement) {
            return $this->notFound('Announcement not found.');
        }

        $announcement->update([
            'status' => 'archived',
        ]);

        return $this->success($announcement, 'Announcement archived successfully.');
    }

    public function pin($id)
    {
        $announcement = Announcement::find($id);

        if (!$announcement) {
            return $this->notFound('Announcement not found.');
        }

        $announcement->update([
            'is_pinned' => !$announcement->is_pinned,
        ]);

        return $this->success($announcement, $announcement->is_pinned ? 'Announcement pinned.' : 'Announcement unpinned.');
    }

    public function markImportant($id)
    {
        $announcement = Announcement::find($id);

        if (!$announcement) {
            return $this->notFound('Announcement not found.');
        }

        $announcement->update([
            'is_important' => !$announcement->is_important,
        ]);

        return $this->success($announcement, $announcement->is_important ? 'Announcement marked as important.' : 'Important status removed.');
    }

    public function uploadAttachment(Request $request, $id)
    {
        $announcement = Announcement::find($id);

        if (!$announcement) {
            return $this->notFound('Announcement not found.');
        }

        $request->validate([
            'attachment' => ['required', 'file', 'max:10240'],
        ]);

        $file = $request->file('attachment');
        $path = $file->store('announcements', 'public');

        $attachment = AnnouncementAttachment::create([
            'announcement_id' => $announcement->id,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ]);

        return $this->created($attachment, 'Attachment uploaded successfully.');
    }

    public function deleteAttachment($id)
    {
        $attachment = AnnouncementAttachment::find($id);

        if (!$attachment) {
            return $this->notFound('Attachment not found.');
        }

        Storage::disk('public')->delete($attachment->file_path);
        $attachment->delete();

        return $this->noContent();
    }

    public function dashboard()
    {
        $announcements = Announcement::with(['creator', 'attachments'])
            ->published()
            ->orderBy('is_pinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return $this->success($announcements, 'Dashboard announcements retrieved successfully.');
    }

    public function stats(Request $request)
    {
        $stats = [
            'total' => Announcement::count(),
            'draft' => Announcement::where('status', 'draft')->count(),
            'published' => Announcement::where('status', 'published')->count(),
            'archived' => Announcement::where('status', 'archived')->count(),
            'pinned' => Announcement::where('is_pinned', true)->count(),
            'important' => Announcement::where('is_important', true)->count(),
        ];

        return $this->success($stats, 'Announcement statistics retrieved successfully.');
    }
}
