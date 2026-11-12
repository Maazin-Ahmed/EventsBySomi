# Supabase diagnostic report

Diagnostic date: 2026-11-11. Checks used the local root `.env`; key values were not printed or recorded.

## 1. Environment file status

**PASS** — `.env` exists in the project root `/home/maazin/Freelance/EventsbySomi`. Each expected variable occurs exactly once. No other `VITE_*` or `SUPABASE_*` variables were found there. `git check-ignore` confirms `.env` is ignored by `.gitignore`.

## 2. Supabase URL verification

**PASS** — `VITE_SUPABASE_URL` matches `https://xuiohhowgpfesakxikvo.supabase.co`.

## 3. Anon/publishable key status

**PASS** — `VITE_SUPABASE_ANON_KEY` is present and non-empty. Its format is a Supabase publishable key. The value is intentionally omitted. Do not interpret presence as proof that protected operations are authorized.

## 4. Vite environment loading

**PASS** — `vite.config.js` is at the project root and uses Vite's default root environment loading. `src/supabase.js` reads exactly `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`; one client is created centrally. No `process.env` frontend access or alternate client initialization was found. The URL appears in source configuration/docs only as the project endpoint. A safe temporary startup diagnostic now prints only CONFIGURED/MISSING and INITIALIZED/FAILED labels. A Vite dev server must be restarted after changing `.env`; this diagnostic cannot prove whether a pre-existing running server had been restarted.

## 5. Actual network connectivity test

**PASS** — DNS lookup succeeded and HTTPS connected to Supabase. Auth health returned **HTTP 200**. Auth health is a service-health check and does not establish RPC permission.

## 6. REST API response

**PASS** — A zero-row `customers` REST query returned **HTTP 200** with the configured publishable key. An anon direct RPC request returned **HTTP 401**, PostgreSQL code `42501`, message `permission denied for function submit_rental_request`. This is consistent with the function not being executable by anon; requests are intended to use the server-side Edge Function credential.

## 7. Database table verification

**PASS (limited)** — zero-row queries selecting all expected customer columns returned **HTTP 200** for `public.customers`; the equivalent expected-column query returned **HTTP 200** for `public.rental_requests`. This verifies the REST API recognizes these tables and expected column names. No customer rows were fetched.

**BLOCKED** — anon REST cannot establish actual column types, foreign keys, request-number defaults/triggers, JSONB type, indexes, constraints, RLS enabled state, or policy definitions. No SQL connection, Supabase CLI, or authenticated project-management credentials are available in this workspace. No schema was changed.

## 8. RPC verification

**PASS (existence evidence)** — PostgREST returned PostgreSQL permission error `42501` for `submit_rental_request`, which indicates the named function is present but anon cannot execute it.

**BLOCKED** — The exact overload/signature, argument types/names, `service_role` execute grant, function body/atomicity, and returned JSON shape cannot be inspected with the available anon key. The local function source calls `submit_rental_request` using `p_customer` and `p_request` named JSON arguments. The direct anon call is not an appropriate way to submit requests and no public grant should be added to fix it.

## 9. Edge Function deployment status

**FAIL** — The local function source exists at `supabase/functions/submit-rental-request/index.ts`, but probes to `https://xuiohhowgpfesakxikvo.supabase.co/functions/v1/submit-rental-request` returned **HTTP 404** for both OPTIONS and a deliberately empty invalid-payload POST, with `Requested function was not found`. Thus this function is not currently deployed at the expected project endpoint (or has not been published under this name).

**BLOCKED** — Required function secrets (`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` or supported equivalent) cannot be inspected without project access. The local source reads these secrets server-side and does not include a credential. No deployment was attempted; the Supabase CLI is not installed and no project deployment credentials are configured here.

## 10. Request submission failure point

Form validation and Supabase client initialization are local and configured. The frontend invokes `submit-rental-request`. The request reaches the configured Supabase host, but the deployed function endpoint responds HTTP 404 before the Edge Function can validate data, call the RPC, or persist either record. Therefore customer update/insert, rental request insert, reference generation, and confirmation are never reached in this observed path.

## 11. Exact root cause

**FAIL — The `submit-rental-request` Edge Function is absent at the configured Supabase project's function endpoint.** The observed response is HTTP 404 `Requested function was not found`. The direct RPC's HTTP 401/`42501` is a separate expected anon-permission denial and must not be bypassed with public database permissions. This diagnosis is based on live network responses, not an inferred missing key or URL mismatch.

## 12. Recommended fix

Deploy the local `submit-rental-request` function to project `xuiohhowgpfesakxikvo`, configure its server-side `SUPABASE_URL` and service-role/secret key through Supabase function secrets, and confirm its service role has execute access to the existing RPC. Then rerun OPTIONS and invalid-payload probes (expect CORS success and validation 4xx, not 404), followed by an authorized real request and database verification. Inspect the actual SQL/RLS/RPC definition in Supabase before diagnosing any remaining database failures. Do not grant anon RPC access or weaken RLS.

## Additional checks

- Browser DevTools Network/console: **NOT TESTED**; no browser inspection tool is available. Manual browser verification should check function POST status and response after deployment.
- Invalid dates/JSONB/RPC payload: **NOT TESTED against database**; requests cannot reach the deployed function. Frontend and local Edge Function source were inspected.
- Service-role key in frontend source: **PASS** — none found.
- Application changes: only a temporary safe startup diagnostic was added. No schema or product code was otherwise modified during this diagnostic.

## Deployment follow-up — 2026-11-12

- Local Edge Function source reviewed in full. It uses Deno native APIs (`Deno.serve`, `Deno.env`, `fetch`) and has no imports requiring installation. Request validation, CORS, method handling, and the `p_customer`/`p_request` RPC payload are present.
- Updated the function secret lookup to prefer `SUPABASE_SECRET_KEY` and fall back to `SUPABASE_SERVICE_ROLE_KEY`; `SUPABASE_URL` remains required. No credential value is present in or logged from source.
- Supabase CLI was not installed globally. Temporary `npx supabase --version` reported **3.1.0**.
- Authentication check `npx --yes supabase projects list` failed with exact CLI error: `AccessTokenRequiredError: Access token not provided. Supply an access token by running supabase login or setting the SUPABASE_ACCESS_TOKEN environment variable.` No token was requested or displayed.
- Deployment and function list verification were **BLOCKED** by missing CLI authentication. Deployment was not attempted. No function HTTP retest was run after the local source change.
- Next action: authenticate the CLI interactively in the user's own terminal/session, without sharing a token. Then deploy only with `supabase functions deploy submit-rental-request --project-ref xuiohhowgpfesakxikvo --use-api`, list functions, and repeat OPTIONS plus invalid-payload HTTP checks.

## Post-deployment integration verification — 2026-11-12

### Deployment and secrets

- **PASS** — `npx supabase functions list --project-ref xuiohhowgpfesakxikvo` lists `submit-rental-request` as `ACTIVE`, version 1, with JWT verification enabled.
- **PASS** — secret names (values filtered out) include `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. The singular `SUPABASE_SECRET_KEY` is not listed, but the function supports the listed legacy key as a fallback. No secret value was printed or stored in this report.

### Live endpoint checks

- **PASS** — `OPTIONS https://xuiohhowgpfesakxikvo.supabase.co/functions/v1/submit-rental-request` returned **HTTP 200**, `Access-Control-Allow-Origin: *`, body `ok`.
- **PASS** — POST with `Content-Type: application/json` and body `{}` returned **HTTP 400**, body `{"error":"Malformed request payload"}`. This is a handler validation response, not a gateway authentication error. No customer data was sent.
- **PASS** — POST with `{ "customer": {}, "request": {} }` returned **HTTP 422**, body `{"error":"Valid name, email, and 10-digit US phone are required"}`. This confirms field validation executes. No database write was attempted by either invalid probe.

### RPC and schema integration

- **PASS** — read-only database inspection confirms the signature is `submit_rental_request(p_customer jsonb, p_request jsonb)`, return type `jsonb`, security definer enabled. The function body inserts/updates customer by normalized email, inserts the rental request using `customer_id` and `requested_items`, and returns JSON including `request_number` and `customer_id`.
- **PASS** — `service_role_can_execute=true`; `anon_can_execute=false`. No public RPC permission was added.
- **PASS** — tables have RLS enabled and no policies. Customers have the expected six columns. Rental requests have expected columns, JSONB `requested_items`, required customer FK, non-empty-array check, unique request number, and `status` default `pending` (allowed status check excludes `received`). The RPC omits status from its insert so the DB default applies; the local Edge Function's extra `status: received` JSON key is ignored by this RPC.
- **PASS** — customer unique index on `lower(email)` matches the RPC's `ON CONFLICT (LOWER(email))`; request number has an `EBS-` UUID-derived default.
- **PASS** — `SUPABASE_URL` and the legacy `SUPABASE_SERVICE_ROLE_KEY` secret names are present. The Edge Function prioritizes `SUPABASE_SECRET_KEY` and falls back to the available legacy service-role secret.

### Logs and frontend

- **PASS (limited log review)** — Supabase CLI function logs were queried for the last 24 hours. Two entries were returned; aggregate classification found no auth failures, missing-secret messages, RPC/permission errors, or invalid-payload log messages. The function does not log validation failures, so this does not mean no invalid requests occurred.
- **NOT TESTED** — Full browser form/cart flow, loading UI, frontend console, and success navigation were not exercised because no browser automation/session is available. Source inspection shows the form invokes the deployed function, requires a non-empty `request_number`, and only reaches the confirmation route after that check; confirmation then clears the cart.
- **NOT TESTED** — No production customer or rental-request rows were inserted. A real end-to-end test requires the user's approval first.

### Approval gate for real test

Prepared test request (not submitted): name `EventsBySomia Integration Test`; email `supabase-integration-test@example.invalid`; phone `9545550100`; event type `Weddings`; event date `2027-01-15`; delivery address and venue labeled `TEST ONLY`; one `Seating / Chiavari chairs` item, quantity 1; notes `TEST ONLY — authorized integration verification`. Submission will create/update a customer row and create a rental request. Obtain explicit user approval before sending it.
