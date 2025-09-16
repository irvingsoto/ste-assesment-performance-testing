import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://fallback-url.com';
const BASIC_AUTH = __ENV.BASIC_AUTH || '';

export const options = {
    scenarios: {
        performance_test: {
            executor: 'ramping-vus',
            stages: [
                { duration: '60s', target: 10 }, // performance test for 60 seconds with 10 users
            ],
            startVUs: 1,
            gracefulRampDown: '10s',
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.01'],
        // Latency SLOs (demo-friendly but meaningful)
        http_req_duration: [
            'p(90)<500',   // 90% under 500ms
            'p(95)<800',   // 95% under 800ms
            'max<2000',    // no single request over 2s
        ],
    },
    discardResponseBodies: true,
    tags: { service: 'benefits-dashboard', endpoint: 'GET /api/Employees' },
};

export default function () {
    const url = `${BASE_URL}/api/Employees`;
    const headers = {
        'Content-Type': 'application/json',
        ...(BASIC_AUTH ? { Authorization: `Basic ${BASIC_AUTH}` } : {}),
    };

    const res = http.get(url, { headers });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'duration < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
}