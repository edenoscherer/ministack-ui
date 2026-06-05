import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand,
  DescribeLogStreamsCommand,
  CreateLogGroupCommand,
  DeleteLogGroupCommand,
  PutRetentionPolicyCommand,
  FilterLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import type { RuntimeProvider, LogGroupMetadata } from '../types';

function createClient(): CloudWatchLogsClient {
  return new CloudWatchLogsClient({
    endpoint: process.env.MINISTACK_ENDPOINT ?? 'http://localhost:4566',
    region: process.env.AWS_REGION ?? 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'ministack',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'ministack',
    },
    // Disable retry/timeout noise in local dev
    maxAttempts: 1,
  });
}

export class MiniStackProvider implements RuntimeProvider {
  private readonly client = createClient();

  async logs(): Promise<void> {
    throw new Error('not implemented');
  }

  async queues(): Promise<void> {
    throw new Error('not implemented');
  }

  async topics(): Promise<void> {
    throw new Error('not implemented');
  }

  async secrets(): Promise<void> {
    throw new Error('not implemented');
  }

  async getLogGroups(): Promise<string[]> {
    const res = await this.client.send(new DescribeLogGroupsCommand({ limit: 50 }));
    return (res.logGroups ?? []).map((g) => g.logGroupName ?? '').filter(Boolean);
  }

  async getLogStreams(logGroup: string): Promise<string[]> {
    const res = await this.client.send(
      new DescribeLogStreamsCommand({ logGroupName: logGroup, limit: 50 }),
    );
    return (res.logStreams ?? []).map((s) => s.logStreamName ?? '').filter(Boolean);
  }

  async getLogGroupsWithMetadata(): Promise<LogGroupMetadata[]> {
    const res = await this.client.send(new DescribeLogGroupsCommand({ limit: 50 }));
    return (res.logGroups ?? [])
      .filter((g) => !!g.logGroupName)
      .map((g) => ({
        name: g.logGroupName!,
        retentionDays: g.retentionInDays ?? null,
        storedBytes: Number(g.storedBytes ?? 0),
        createdAt: g.creationTime
          ? new Date(g.creationTime).toISOString()
          : new Date().toISOString(),
      }));
  }

  async createLogGroup(name: string, retentionDays?: number | null): Promise<LogGroupMetadata> {
    await this.client.send(new CreateLogGroupCommand({ logGroupName: name }));
    if (retentionDays != null) {
      await this.client.send(
        new PutRetentionPolicyCommand({ logGroupName: name, retentionInDays: retentionDays }),
      );
    }
    return {
      name,
      retentionDays: retentionDays ?? null,
      storedBytes: 0,
      createdAt: new Date().toISOString(),
    };
  }

  async deleteLogGroup(name: string): Promise<void> {
    await this.client.send(new DeleteLogGroupCommand({ logGroupName: name }));
  }

  async streamLogs(
    onLog: (log: string) => void,
    filter?: { logGroup?: string; logStream?: string },
  ): Promise<() => void> {
    let stopped = false;
    // Start from now — only tail new events
    let lastTimestamp = Date.now();

    // FilterLogEventsCommand requires a logGroupName; resolve from filter or pick the first group
    let logGroupName = filter?.logGroup ?? null;
    if (!logGroupName) {
      const groups = await this.getLogGroups();
      logGroupName = groups[0] ?? null;
    }

    if (!logGroupName) {
      // No log groups exist on the server — return a no-op stream
      return () => {};
    }

    const resolvedGroup = logGroupName;

    const poll = async () => {
      if (stopped) return;

      try {
        const res = await this.client.send(
          new FilterLogEventsCommand({
            logGroupName: resolvedGroup,
            logStreamNames: filter?.logStream ? [filter.logStream] : undefined,
            startTime: lastTimestamp,
            limit: 50,
          }),
        );

        for (const event of res.events ?? []) {
          if (!event.message || event.timestamp == null) continue;
          // Only emit events we haven't seen yet
          if (event.timestamp >= lastTimestamp) {
            onLog(event.message);
            lastTimestamp = event.timestamp + 1;
          }
        }
      } catch (err) {
        // Log but keep polling — transient connectivity issues are common in local dev
        console.error('[MiniStackProvider] streamLogs poll error:', err);
      }

      if (!stopped) {
        setTimeout(poll, 1000);
      }
    };

    poll();
    return () => {
      stopped = true;
    };
  }
}
