# Phase 4.3 critical bug fix report

## Submission pipeline findings

The source shows two confirmed response-handling defects: the Edge Function returned HTTP 200 even when it could not extract a request number, and the frontend then navigated to confirmation without requiring a reference. RPC failures were also collapsed to a generic 502. These defects could make a non-persisted request look successful. They are fixed: the function now rejects RPC errors and missing references, and the form requires a returned `request_number` before navigating or clearing the cart. The form prevents repeat clicks while submitting, uses the Supabase function client, preserves form values on failure, and displays the requested retry message.

No authenticated access to the Supabase project, Edge Function logs, browser Network panel, or PostgreSQL was available during this work. Therefore there is no observed failed production request to attribute to a specific HTTP response, and no actual response status, RPC error, schema, RLS policy, or stored row can be reported. The endpoint used by the frontend is `https://xuiohhowgpfesakxikvo.supabase.co/functions/v1/submit-rental-request`; the expected internal RPC endpoint is `/rest/v1/rpc/submit_rental_request`. Live status is **not observed**. Do not treat the code-level findings as proof that this was the only production failure cause.

## Schema and security compatibility

The repository contains no SQL schema, migration, or project connection credentials, so the `customers` and `rental_requests` columns, foreign key, request number generation, JSONB structure, RPC signature/permissions, country_code column, and RLS policies could not be inspected. The Edge Function continues to pass only `full_name`, normalized email, and 10-digit phone in `p_customer`, and the existing request fields in `p_request`; it does not send `country_code` or alter schema/policies. Verify whether the existing RPC handles +1 compatibility as required before deployment. No public policies or tables were added. The service-role credential is read only from Edge Function environment variables; no service-role key is in frontend source.

## Changes

- Popup: locks body scroll while open, compensates for scrollbar width, uses a viewport-bounded independently scrolling modal with touch scrolling and overscroll containment, stops wheel bubbling, restores body styles, and closes with Escape.
- Phone: fixed non-editable +1 prefix, live US formatting, exactly 10 digits in frontend and Edge Function, and normalized 10-digit value sent to the RPC. Confirmation displays the full +1 formatted phone.
- Dates: local calendar date comparison for event date; delivery on/before event and pickup on/after event. Server validation checks ISO calendar dates and date ordering with a one-day UTC tolerance for local timezone boundaries.
- Submission: exact configuration error when the anon key is unavailable; RPC/function failures do not show confirmation; missing request reference is treated as failure; duplicate submit is blocked during request; cart clearing occurs only after a reference was returned.

## Verification

- Production build: run result recorded in final response.
- Browser modal mouse, trackpad, touch, keyboard, 360px viewport: not run in a browser harness.
- Supabase valid/invalid submission, customer reuse, FK, JSONB, request number, rollback, and RLS checks: not run; requires project access and deployed Edge Function.
- HTTP status/error from an actual function call: not available; no live request was made.
- `.env` remains ignored by Git. No key values are included in this report.

## Phase tracker

| Phase | Description | Status |
| --- | --- | --- |
| 1 | Homepage & Visual Identity | Complete |
| 2 | Celebrations & Rental Catalogues | Complete |
| 3 | Gallery & Enquiry Experience | Complete |
| 4 | Supporting Pages & SEO | Complete |
| 4.1 | Image Deduplication | Complete |
| 4.2 | Image Coverage & Rendering Repair | Complete |
| 4.3 | Rental Cart & Custom Quote Request | In Progress |
| 5 | Admin Dashboard | Not Started |
| 6 | Analytics & Lead Tracking | Planned |
| 7 | Final Launch Audit | Planned |

## Remaining blockers

1. Inspect the live schema, RPC definition and execute a test request with Supabase access.
2. Confirm whether a `country_code` column exists and adapt the RPC payload only if the actual schema requires it.
3. Deploy the updated Edge Function and verify its actual response contract returns the generated `request_number`.
4. Verify RLS policies and run duplicate-customer/multiple-request and failed-transaction checks.
5. Run interactive modal and end-to-end tests in desktop and mobile browsers.
