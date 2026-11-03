# Events by Somia

Responsive event design and rentals website built with React, Vite, GSAP, and GSAP ScrollTrigger. Pinned horizontal showcases are desktop-only; touch layouts retain native vertical scrolling and horizontal swipe. Reduced-motion preferences disable the pinned effects and Lenis.

## Run locally

```sh
npm install
npm run dev
```

The Vite development server includes `/api/enquiries`. For a production build, run `npm run build` then `npm start`; the Node server serves `dist` and the enquiry API on port 4173 (or `PORT`).

## Enquiry delivery

Copy `.env.example` to `.env` and configure `EMAIL_RELAY_URL`, set `ENQUIRY_TO_EMAIL=contact@eventsbysomia.com`, and optionally configure `EMAIL_RELAY_TOKEN`. The relay is a trusted HTTPS JSON endpoint that sends the provided message; it receives `to`, `subject`, `replyTo`, `text`, and the validated `enquiry` object. The form returns success only after the relay responds with a 2xx status. Until configured, submissions return an explicit delivery error. Do not expose relay credentials in client code. On Vercel, add the same variables in Project Settings → Environment Variables for each deployment environment, then redeploy.

The endpoint validates all required fields, strips unknown rental/service options, rejects honeypot submissions, limits payload size, and rate-limits requests per IP. By default, rate limiting uses the direct connection address. Set `TRUST_PROXY=true` only when a trusted reverse proxy strips and replaces `X-Forwarded-For`.

## Brand and photography

The listed rental inventory is taken from the supplied project brief. Contact details in the site use the provided Events by Somia business information. The gallery uses editorial inspiration photography from Unsplash and clearly identifies it as inspiration, not completed client work. The project has no local business inventory photography; replace category images with licensed inventory photography and self-host responsive AVIF/WebP variants when available. WhatsApp uses the supplied business phone number. The privacy and terms sections contain brief site-specific summaries and should be replaced with approved legal text before launch.
# EventsBySomia
