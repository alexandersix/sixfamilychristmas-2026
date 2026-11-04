<?php

namespace App\Http\Middleware;

use App\Models\Issue;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthorizeIssue
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Issue $issue */
        $issue = $request->route('issue');
        abort_unless($issue->is_published, 404);
        abort_if($issue->password === null, 403);

        $access = $request->session()->get('issue_access.'.$issue->id);

        if (! is_array($access)
            || ($access['expires_at'] ?? 0) <= now()->getTimestamp()
            || ! hash_equals(hash('sha256', $issue->password), $access['password_hash'] ?? '')) {
            $request->session()->forget('issue_access.'.$issue->id);
            $response = redirect()->route('issues.login', $issue->slug);
        } else {
            $response = $next($request);
        }

        $response->headers->set('Cache-Control', 'private, no-store');

        return $response;
    }
}
