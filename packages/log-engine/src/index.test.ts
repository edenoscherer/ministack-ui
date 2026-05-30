import { test } from 'node:test';
import assert from 'node:assert';
import { parseLog } from './index';

test('Log Parser Engine', async (t) => {
  await t.test('should parse a pure JSON log correctly', () => {
    const raw = JSON.stringify({
      id: 'custom-123',
      timestamp: '2026-05-30T10:00:00.000Z',
      level: 'ERROR',
      service: 'payment-service',
      message: 'Transaction failed',
      extra_info: 'Insufficent funds',
      amount: 150,
    });

    const result = parseLog(raw);

    assert.strictEqual(result.id, 'custom-123');
    assert.strictEqual(result.timestamp, '2026-05-30T10:00:00.000Z');
    assert.strictEqual(result.level, 'ERROR');
    assert.strictEqual(result.service, 'payment-service');
    assert.strictEqual(result.message, 'Transaction failed');
    assert.deepStrictEqual(result.payload, { extra_info: 'Insufficent funds', amount: 150 });
  });

  await t.test('should parse a structured flat text log with regex', () => {
    const raw =
      '2026-05-30T10:00:00.000Z [WARN] auth-service: Login limit reached {"ip":"192.168.1.1"}';
    const result = parseLog(raw);

    assert.ok(result.id.startsWith('log-'));
    assert.strictEqual(result.timestamp, '2026-05-30T10:00:00.000Z');
    assert.strictEqual(result.level, 'WARN');
    assert.strictEqual(result.service, 'auth-service');
    assert.strictEqual(result.message, 'Login limit reached');
    assert.deepStrictEqual(result.payload, { ip: '192.168.1.1' });
  });

  await t.test('should fallback to plain text parser when log format is raw', () => {
    const raw = 'Something went wrong inside the database server';
    const result = parseLog(raw);

    assert.ok(result.id.startsWith('log-'));
    assert.strictEqual(result.level, 'INFO'); // Default level is INFO
    assert.strictEqual(result.service, 'system');
    assert.strictEqual(result.message, 'Something went wrong inside the database server');
  });

  await t.test('should gracefully handle and parse malformed JSON inputs as plain text', () => {
    const raw = '{ invalid-json-here';
    const result = parseLog(raw);

    assert.ok(result.id.startsWith('log-'));
    assert.strictEqual(result.level, 'INFO');
    assert.strictEqual(result.service, 'system');
    assert.strictEqual(result.message, '{ invalid-json-here');
  });
});
