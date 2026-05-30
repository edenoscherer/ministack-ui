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
      '2026-05-30T10:00:00.000Z [WARN] auth-service: Login limit reached {"ip":"127.0.0.1"}';
    const result = parseLog(raw);

    assert.ok(result.id.startsWith('log-'));
    assert.strictEqual(result.timestamp, '2026-05-30T10:00:00.000Z');
    assert.strictEqual(result.level, 'WARN');
    assert.strictEqual(result.service, 'auth-service');
    assert.strictEqual(result.message, 'Login limit reached');
    assert.deepStrictEqual(result.payload, { ip: '127.0.0.1' });
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

  await t.test(
    'should defensively truncate extremely long log inputs to protect against ReDoS and memory overflow',
    () => {
      const rawHuge = 'A'.repeat(25000);
      const result = parseLog(rawHuge);

      assert.strictEqual(result.level, 'ERROR');
      assert.strictEqual(result.service, 'system');
      assert.ok(result.message.includes('[Truncated due to size limit for security]'));
      assert.strictEqual(result.message.length, 1046); // 1000 + length of suffix
    },
  );

  await t.test(
    'should extract linear JSON payload safely even when message ends with non-payload curly braces',
    () => {
      const rawNoJson = '2026-05-30T10:00:00.000Z [INFO] main: Message with a non-json {block}';
      const result = parseLog(rawNoJson);

      assert.strictEqual(result.message, 'Message with a non-json {block}');
      assert.strictEqual(result.payload, undefined);
    },
  );
});
