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
