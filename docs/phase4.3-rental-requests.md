# Phase 4.3 — Rental cart and custom quote requests

## Architecture

The rental catalogue remains in `src/content.js`; cart records are browser-only localStorage data keyed by stable category and product slugs. The cart is never sent to Supabase until the customer submits a quote request. The app expects the existing `customers` and `rental_requests` tables and the `public.submit_rental_request(p_customer JSONB, p_request JSONB)` RPC. This change creates no database tables or policies.

## Edge Function

Deploy `supabase/functions/submit-rental-request` as `submit-rental-request`. Configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as function secrets. The service key is used only in the function. Set frontend `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to call it. The function validates contact/event fields and item snapshots before invoking the RPC. Production RPC response shape must include `request_number`; confirm this against the existing function before deployment.

## Email

No email provider or credentials are present in the inspected repository. Email delivery is not implemented. Add provider delivery after RPC success in the Edge Function, with failures logged without customer PII and never returned as a failed request submission.

## Verification and blockers

The local production build is the available code-level check. No Supabase project URL/keys, database connection, or deployed function credentials are configured here, so schema/RLS, RPC response shape, customer reuse, request insertion, and live submission cannot be verified from this checkout. Phase 4.3 remains in progress until deployed integration and the full journey are tested.

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
