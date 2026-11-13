# ADR-006: Comprehensive Static Case Studies instead of AI Chatbot in v1

## Status
Accepted

## Context
Personal portfolios occasionally incorporate conversational AI chatbots to answer recruiter questions. However, for a professional software engineer specializing in backend engineering, database optimization, and distributed systems, an interactive AI bot introduces substantial professional risks:
- Hallucinations: AI models can invent false qualifications, project accomplishments, or technical claims that contradict Fuad's actual experience.
- Cost: LLM API tokens require paid subscriptions or metered API keys (OpenAI, Anthropic, Gemini API) that can be abused by automated bots.
- Tone & Reliability: Conversational interfaces often obscure direct factual evidence behind a chat prompt, creating friction for busy recruiters and hiring managers who need to evaluate qualifications within 30 seconds.

## Decision
We reject conversational AI chatbots for the v1 portfolio. Instead, we prioritize **structured, evidence-driven static case studies** (`/projects/[slug]`) and detailed engineering articles (`/blog/[slug]`).
- Case studies present verified problem statements, architecture diagrams, technology justifications, and verified outcomes.
- Technical blog posts demonstrate engineering depth, clean code principles, and problem-solving methodology directly in prose and code snippets.
- Navigation allows recruiters to reach verified facts in 1–2 clicks without typing into a prompt.

## Consequences
### Positive
- **Factual Integrity:** Zero risk of artificial hallucinations or inaccurate claims.
- **Recruiter Efficiency:** Hiring managers can scan structured bullet points, diagrams, and repository links immediately.
- **Zero Ongoing Cost:** No LLM token consumption or API billing.
- **Accessibility:** Pure semantic HTML is readable by all screen readers and assistive technologies.

### Negative / Trade-offs
- The website lacks a novel interactive conversational gimmick, but gains maximum professional credibility.

