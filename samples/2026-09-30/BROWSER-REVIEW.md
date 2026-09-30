# Browser review — 30 September 2026

The eight public sample entry points loaded successfully in the cloud Chrome browser after publication of commit `df264327cab60c0f1dd4a48b30b4996b7b000af0`. These checks concern the independent samples, not the companies' production sites.

| Sample | Observed interaction |
| --- | --- |
| VHP | The two public records produce one same-code/different-name group. Malformed CSV keeps the previous successful results with an explicit error. A synthetic HTML-like product name renders as text. Reset restores the two public records. |
| GoTripod | Loading the synthetic example, simulating a connection failure, and retrying preserves the enquiry and produces a local preview. |
| SplashSol | Project and freelance branches both produce the correct labelled summary. Switching branches retains common contact data. Loading the synthetic example restores its default project intent; select the freelance branch afterward to review that path. |
| Inventomo | The example instant displays 19:00 Pakistan, 10:00 New York and 21:00 Vietnam on 15 October 2026. New York 8 March 2026 at 02:30 is rejected as nonexistent, with entered details retained. |
| Mother Tongue | Switching the synthetic example to the freelance branch produces a labelled subject and retains the original message. |
| MasterTech | The synthetic example produces text and visible JSON with company, timeline and budget explicitly null/unknown. |
| Facility | The published-reference fixture reports six records and zero local flags. Practice mode reports exactly three deliberately injected faults and disables its destination links. |
| LMC | At 181 UTF-16 code units the copy control is disabled and one-over feedback appears; the complete brief remains intact. At 180 the control is enabled. |

Eight local logic suites passed with `node run-tests.cjs`. The existing repository verification and GitHub Pages deployment workflows also completed successfully for the publication commit. The existing repository CI does not substitute for the separate sample logic runner.

## Limits

These were focused browser interaction checks at the available desktop viewport. The provided Playwright browser suites, mobile-width checks, complete keyboard audit and clipboard behavior have not all been run. The normal Playwright browser installation failed with an incomplete download; no success is claimed for that attempt.

The initial VHP download event was not captured within the browser tool's timeout. A prepared CSV or a page status message is not proof of a saved file. A follow-on patch therefore provides a visible, selectable CSV preview and describes a requested download accurately. The pure serializer tests cover CSV content and spreadsheet-formula protection; end-to-end saved-file verification remains unconfirmed.

No customer form was submitted by running these samples. No company site was changed, private customer input used, paid API started or measured business outcome produced.
