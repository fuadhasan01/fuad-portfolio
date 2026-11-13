# ADR-005: Obfuscated Email Link Baseline instead of Backend Contact Form in v1

## Status
Accepted

## Context
Providing a direct communication path for recruiters, clients, and technical peers is a primary objective (OBJ-02, FR-010). 

Common implementation approaches include:
1. An interactive contact form submitting to a custom server endpoint or third-party SaaS (e.g., Formspree, Formkeep, Resend, SendGrid).
2. A direct public `mailto:` link and professional social channels (LinkedIn, GitHub).

Backend contact forms introduce distinct disadvantages for a static v1 release:
- They require CAPTCHA (e.g., reCAPTCHA, Cloudflare Turnstile) or honeypot fields to prevent automated bot spam.
- Free-tier form APIs often have strict monthly submission quotas, embed third-party tracking scripts, or route private messages through untrusted intermediaries.
- Maintaining a custom serverless function to forward emails requires secret API tokens, environment variable management, and monitoring.

## Decision
For v1 launch, we establish a **protected `mailto:` link combined with a one-click copy button** on the `/contact` page and footer.
- The contact email is rendered cleanly with an accessible "Copy Email" button that provides instant visual feedback ("Copied to clipboard").
- Direct links to verified professional profiles (LinkedIn, GitHub) are prominently provided alongside email.
- Automated email scraping protection is applied (obfuscation via client rendering or encoded strings).
- If the owner later requires an in-browser form, a dedicated ADR and backend spam-protection specification will be introduced in a future phase.

## Consequences
### Positive
- **Zero Third-Party Dependencies:** No reliance on external form services, API keys, or spam submission quotas.
- **Privacy & Security:** Messages flow directly from the sender's mail client to Fuad's inbox without passing through a third-party form handler.
- **Zero Operational Cost:** Operates indefinitely with $0 cost.
- **Accessible UX:** Standard email clients open immediately on mobile and desktop devices.

### Negative / Trade-offs
- Visitors without an active default desktop email client must use the "Copy Email" button to paste into webmail (e.g., Gmail).

