import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 },  // Stay at 20 users for 1 minute
    { duration: '30s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<5'], // 95% of requests should be below 2s
    http_req_failed: ['rate<0.01'],    // Less than 1% of requests should fail
  },
};

const BASE_URL = 'http://localhost:5533/api/v1';
let createdMenuId = null;

export default function () {
  // 1. Create Menu
  const createPayload = {
    name: `Menu ${randomString(8)}`,
    relatedId: '64bf3c4f58b470c6e06c5429' // Example ObjectId
  };

  const createRes = http.post(`${BASE_URL}/menu`, JSON.stringify(createPayload), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(createRes, {
    'create menu status is 201': (r) => r.status === 201,
    'create menu response has id': (r) => r.json('id') !== undefined,
  });

  if (createRes.status === 201) {
    createdMenuId = createRes.json('id');
  }

  sleep(1);

  // 2. Fetch Menus
  const getRes = http.get(`${BASE_URL}/menu`);

  check(getRes, {
    'get menus status is 200': (r) => r.status === 200,
    'get menus response is array': (r) => Array.isArray(r.json()),
  });

  sleep(1);

  // 3. Delete Menu (if we have an ID from creation)
  if (createdMenuId) {
    const deleteRes = http.del(`${BASE_URL}/menu/${createdMenuId}`);

    check(deleteRes, {
      'delete menu status is 204': (r) => r.status === 204,
    });
  }

  sleep(1);
}
