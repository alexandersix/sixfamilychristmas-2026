# Commit attribution

- For `alexandersix/sixfamilychristmas-2026` only, Alexander authorizes `Amp-Thread-ID: <thread URL>` trailers on new commits across all Spaces and threads, including existing threads. This supersedes his earlier prohibition on thread-link trailers for this project only.
- Use Alexander's human Git identity. Keep Amp and other AI authors, AI `Co-authored-by` trailers, and other AI-credit notices off. Other projects and global defaults are unchanged.
- `.amp/settings.json` enables thread trailers and disables Amp co-author credit for this repository. Personal environment variables override project variables, so a personal `AMP_DISABLE_AMP_THREAD_TRAILER=1` still blocks thread trailers even when the project value is `0`. Do not change personal settings without Alexander's approval.
- Existing orbs must run `amp orb restart-processes` and read this guidance and `.amp/settings.json` before future commits. Verify the effective thread-trailer disable variable is not `1`; if it is, report that trailers remain blocked. Never add the trailer manually to bypass Amp's controls.
- Do not rewrite existing commits or rerun shipping or deployments to add missing trailers.
