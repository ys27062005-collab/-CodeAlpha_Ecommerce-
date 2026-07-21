import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeOrdersPayload } from './orders.mjs';

test('returns an array from an orders array payload', () => {
  const payload = [{ _id: '1', status: 'Pending' }];
  assert.deepEqual(normalizeOrdersPayload(payload), payload);
});

test('returns orders from an object payload', () => {
  const payload = { orders: [{ _id: '2', status: 'Delivered' }] };
  assert.deepEqual(normalizeOrdersPayload(payload), payload.orders);
});

test('returns an empty array for missing payload', () => {
  assert.deepEqual(normalizeOrdersPayload(undefined), []);
  assert.deepEqual(normalizeOrdersPayload(null), []);
});
