# ste-assesment-performance-testing

**Performance test for GET /api/Employees
**
Objective: Verify the GET /api/Employees responsiveness and reliability under light, steady traffic.

**Workload Profile (k6):**

Executor: ramping-vus
Stages: ramp up to 10 virtual users and hold for ~60s 
Pacing: ~1 request per VU per second (with sleep(1))


**Success Criteria (Thresholds / SLOs):**
Reliability: http_req_failed < 1%

**Latency:**
http_req_duration p(90) < 500 ms
http_req_duration p(95) < 800 ms
http_req_duration max < 2000 ms (no single extreme outlier)

**Steps:**
Send GET /api/Employees with Basic Auth header.

**Validate response:**
Status is 200.
Duration check: duration < 500ms
Sleep 1s to maintain gentle pacing.

----------------------------------------------------------------------------------------------------------------------------------

**Test Run Results: **

<img width="1109" height="1000" alt="image" src="https://github.com/user-attachments/assets/ace34248-961d-4a91-8ead-29ab0bf6c6fc" />

Duration: ~60s hold (total ~61s including graceful periods)
Max VUs: 10
Total requests: 236
Error rate: 0.00% (all requests succeeded)

**Latency distribution:**
avg 287.84 ms
p(90) 346.53 ms ✅ (meets <500 ms)
p(95) 365.67 ms ✅ (meets <800 ms)
max 2.41 s ❌ (breaches <2000 ms)

**Checks:**
“status is 200”: 100% ✅
“duration < 500ms”: 234/236 (≈99%) — 2 iterations exceeded 500 ms

**Threshold Verdicts:**
http_req_failed: rate<0.01 → PASS (0.00%)
http_req_duration: p(90)<500 → PASS
http_req_duration: p(95)<800 → PASS
http_req_duration: max<2000 → FAIL (observed max 2.41s)

**
Overall Result: **

❌ FAILED due to a single outlier above the max-latency threshold, despite excellent p90/p95 and zero errors.
