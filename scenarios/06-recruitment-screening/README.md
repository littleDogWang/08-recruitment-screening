# 06 Recruitment screening

`job.json` defines job-related requirements. `screening.ts` maps candidate
facts to matched and missing fields, and the results API always returns
`human_review`. Sensitive personal information is excluded from scoring.


## Local conversation and optional tools

Default conversations retain the job.json requirements and six interview topics already embedded in the prompt. The assistant gathers candidate statements and verbally summarizes facts for human review; it does not save records or make hiring decisions. The optional tool returns a structured result only, without durable persistence.

TOP_TEN_SCENARIO_TOOL_BASE_URL is optional. Only an explicitly configured public HTTPS endpoint enables tools; malformed, HTTP, localhost and local/private origins leave tools disabled. URL validation does not prove network reachability. No tunnel, knowledge base or database is needed for the default conversation. Local checks do not establish live speech or cloud callback acceptance.
