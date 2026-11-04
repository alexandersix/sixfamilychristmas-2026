<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class IssueLoginController extends Controller
{
    public function show(Issue $issue): Response
    {
        abort_unless($issue->is_published, 404);
        abort_if($issue->password === null, 403);

        Inertia::clearHistory();

        $response = Inertia::render('issues/login', [
            'loginUrl' => route('issues.login.store', $issue->slug),
            'issueName' => $issue->name,
        ])->toResponse(request());
        $response->headers->set('Cache-Control', 'private, no-store');

        return $response;
    }

    public function store(Request $request, Issue $issue): RedirectResponse
    {
        abort_unless($issue->is_published, 404);
        abort_if($issue->password === null, 403);

        $key = 'issue-login:'.$issue->id.':'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            throw ValidationException::withMessages([
                'password' => 'Too many attempts. Please try again in '.RateLimiter::availableIn($key).' seconds.',
            ]);
        }

        RateLimiter::hit($key, 60);
        $validated = $request->validate(['password' => ['required', 'string', 'max:72']]);

        if (strlen($validated['password']) > 72 || ! Hash::check($validated['password'], $issue->password)) {
            throw ValidationException::withMessages([
                'password' => 'That password doesn’t match. Please try the password we shared with you.',
            ]);
        }

        RateLimiter::clear($key);
        $request->session()->regenerate();
        $request->session()->put('issue_access.'.$issue->id, [
            'expires_at' => now()->addDay()->getTimestamp(),
            'password_hash' => hash('sha256', $issue->password),
        ]);

        return redirect()->route('issues.show', $issue->slug)
            ->withHeaders(['Cache-Control' => 'private, no-store']);
    }
}
