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
        return $this->render($issue, false);
    }

    public function cover(Issue $issue): Response
    {
        abort_if($issue->cover_photo_path === null, 404);

        return Storage::disk('s3')->response($issue->cover_photo_path);
    }

    public function photo(Issue $issue, int $event, int $photo): Response
    {
        $story = $issue->events()->findOrFail($event);
        abort_unless(isset($story->photos[$photo]), 404);

        return Storage::disk('s3')->response($story->photos[$photo]['path']);
    }

    public function preview(Request $request, Issue $issue): Response
    {
        abort_unless($request->user()?->canAccessPanel(Filament::getPanel('admin')), 403);

        return $this->render($issue, true);
    }

    private function render(Issue $issue, bool $preview): Response
    {
        Inertia::encryptHistory();

        $response = Inertia::render('issues/show', [
            'issue' => [
                'name' => $issue->name,
                'publication_name' => $issue->publication_name,
                'motto' => $issue->motto,
                'edition_description' => $issue->edition_description,
                'left_navigation_label' => $issue->left_navigation_label,
                'right_navigation_label' => $issue->right_navigation_label,
                'cover_photo' => $issue->cover_photo_path ? [
                    'src' => $preview
                        ? Storage::disk('s3')->temporaryUrl($issue->cover_photo_path, now()->addHour())
                        : route('issues.cover', $issue->slug),
                    'alt' => $issue->cover_photo_alt,
                ] : null,
                'cover_photo_alt' => $issue->cover_photo_alt,
                'cover_headline' => $issue->cover_headline,
                'cover_introduction' => str_replace('{year}', $issue->name, $issue->cover_introduction),
                'cover_link_label' => $issue->cover_link_label,
                'last_word' => $issue->show_last_word ? [
                    'title' => $issue->last_word_title,
                    'salutation' => $issue->last_word_salutation,
                    'body' => Str::sanitizeHtml($issue->last_word_body ?? ''),
                    'sign_off' => $issue->last_word_sign_off,
                    'signature' => $issue->last_word_signature ?: $issue->publication_name,
                ] : null,
                'events' => $issue->events->filter(fn (Event $event): bool => count($event->photos) > 0)->values()->map(fn (Event $event): array => [
                    'id' => $event->id,
                    'name' => $event->name,
                    'title' => $event->title,
                    'note' => $event->note,
                    'body' => Str::sanitizeHtml($event->body),
                    'photos' => array_map(fn (array $photo, int $index): array => [
                        'src' => $preview
                            ? Storage::disk('s3')->temporaryUrl($photo['path'], now()->addHour())
                            : route('issues.photos.show', [$issue->slug, $event->id, $index]),
                        'alt' => $photo['alt'],
                        'caption' => $photo['caption'] ?? null,
                    ], $event->photos, array_keys($event->photos)),
                ]),
            ],
            'preview' => $preview,
        ])->toResponse(request());
        $response->headers->set('Cache-Control', 'private, no-store');

        return $response;
    }
}
