# 06 Recruitment screening

`job.json` defines job-related requirements. `screening.ts` maps candidate
facts to matched and missing fields, and the results API always returns
`human_review`. Sensitive personal information is excluded from scoring.
