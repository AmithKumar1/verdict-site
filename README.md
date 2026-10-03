# Public Research Website

This is the visitor-facing publication layer for the accountability research system.

The public site deliberately exposes:
- research briefs;
- evidence states;
- source trails;
- timelines;
- funding records;
- relationship records;
- unresolved research questions;
- community evidence submission.

It deliberately does not expose:
- repository paths;
- GitHub URLs;
- crawler names;
- OSINT tools;
- agent prompts;
- internal algorithms;
- private evidence;
- raw research artifacts.

The page uses a scroll-first presentation inspired by the interaction model of Nothing.gripe: full-screen sections, progress feedback, intersection-based reveals and compact information cards.

The public surface should consume the canonical reviewed/public projection from the API in production. The current static page carries the existing case data as a visual prototype.
