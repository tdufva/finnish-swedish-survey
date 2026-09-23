# Bildlärarenkäten

A Swedish/Finnish, mobile-friendly art-teaching survey transcribed from the supplied **Bildlärare-2.pdf**. Hosted on GitHub Pages; responses are stored in private Supabase tables.

## Status

Live: https://tdufva.github.io/finnish-swedish-survey/

Swedish: https://tdufva.github.io/finnish-swedish-survey/?lang=sv

Finnish: https://tdufva.github.io/finnish-swedish-survey/?lang=fi

The Svenska / Suomi switch translates the entire interface and preserves in-progress answers. Finnish translates the original Swedish study; it does not change its target population or replace Swedish institutions with Finnish ones.

Response storage uses dedicated `bildlarare_*` tables in the existing **Prague project**, Supabase ref `fcgdqhikzhsuyltuvogj`, EU Central (Frankfurt).

## Content

- 36 substantive survey questions plus consent, including both unnumbered activity matrices (60 matrix statements in total).
- Finnish wording is in `docs/fi.js`, interface translations in `docs/ui.js`. Choice values are stored consistently using the original Swedish labels, regardless of the selected display language; free text remains as typed.
- Original export IDs are retained as response keys (e.g. `Q24` is consent, not displayed question 24).
- Seven sections, optional answers, conditional additional-subject question, “Annat” text, review before submit.
- Original checkbox controls preserved for school type, student device access, and AI training.
- No participant login, analytics, third-party fonts, or cookies. Unsaved answers live in memory only; refreshing/closing loses them.
- Interview interest is a separate submission with a separate random ID, no survey response ID, and no saved timestamp.

See [source notes](SOURCE_NOTES.md) for gaps in the PDF and transcription decisions. The source PDF remains local and is excluded from the public repository.

## Local preview and tests

Run `python3 -m http.server 4173 --directory docs`, then visit http://localhost:4173.

With Node 20+ installed, run `npm test` (no package installation needed).

## Response storage configuration

Already configured. To reproduce in a new Supabase project:

1. Apply `database/schema.sql` in the selected Supabase project.
2. Add its API URL and a **publishable** key to `docs/config.js`. Never use a secret or service-role key.
3. Verify anonymous inserts and that anonymous/authenticated reads, updates and deletes are denied.
4. Publish `docs/` via GitHub Pages (main branch).

Both tables enable row-level security. Anonymous visitors may insert only. Only the project's privileged owner/admin can view or export responses. Access these in Supabase Table Editor:

- `bildlarare_responses`: questionnaire answers, consent, schema version, random submission ID.
- `bildlarare_interview_contacts`: separately submitted name/email and interview consent.

There is no relationship or shared ID between the tables. Hosting providers may retain operational logs; these are separate from the application database. Do not add precise response/contact timestamps or common identifiers, as these could enable linkage. Free-text answers may still contain identifying information supplied by participants.

### Export for analysis

Export the responses table as JSON/CSV from the authenticated Supabase dashboard. Matrix answers use zero-based row indices; the row wording, order, and choice labels are in `docs/questions.js`. Do not commit response exports or contacts to this public repository.

### Operational notes

The survey uses public write-only endpoints. Database constraints bound payload size and reject unknown top-level response fields, but public endpoints may receive spam. Consider a server-side bot challenge/rate limiting if needed before large-scale distribution. Researcher names, study scope, and information text come from the supplied PDF; the study owner is responsible for the actual research/data-handling arrangements.

## Verification

Node tests verify question coverage, all 60 matrix rows, conditional data cleaning and complete Finnish translation coverage. Browser checks covered desktop/mobile layouts, changing language without losing answers, consent, branching, multi-select behavior, review, real response/contact submissions, and duplicate protection. Anonymous read/update/delete requests were denied for both tables; authenticated privileges were also checked. Test records were removed after validation.

Supabase security advisors reported no findings for the survey tables. Existing project findings concern unrelated trip-management functions ([public function guidance](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable), [signed-in function guidance](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable)) and [password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). Existing project behavior was not changed.
