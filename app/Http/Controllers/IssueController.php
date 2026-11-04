<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Issue;
use Filament\Facades\Filament;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class IssueController extends Controller
{
    public function show(Issue $issue): Response
    {
        abort_unless($issue->is_published, 404);

        return $this->render($issue, false);
    }

    public function preview(Request $request, Issue $issue): Response
    {
        abort_unless($request->user()?->canAccessPanel(Filament::getPanel('admin')), 403);

        return $this->render($issue, true);
    }

    private function render(Issue $issue, bool $preview): Response
    {
        $response = Inertia::render('issues/show', [
            'issue' => [
                'name' => $issue->name,
                'events' => $issue->events->map(fn (Event $event): array => [
                    'id' => $event->id,
                    'name' => $event->name,
                    'title' => $event->title,
                    'note' => $event->note,
                    'body' => Str::sanitizeHtml($event->body),
                    'photos' => array_map(fn (array $photo): array => [
                        'src' => Storage::disk('s3')->temporaryUrl($photo['path'], now()->addHour()),
                        'alt' => $photo['alt'],
                        'caption' => $photo['caption'] ?? null,
                    ], $event->photos),
                ]),
            ],
            'preview' => $preview,
        ])->toResponse(request());
        $response->headers->set('Cache-Control', 'private, no-store');

        return $response;
    }
}
