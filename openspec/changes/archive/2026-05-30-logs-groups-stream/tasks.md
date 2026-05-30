## 1. Shared Types & Runtime SDK Updates

- [ ] 1.1 Update `LogMessage` interface in `packages/shared/src/types.ts` to include optional `logGroup?: string` and `logStream?: string` fields.
- [ ] 1.2 Update `RuntimeProvider` interface in `packages/runtime-sdk/src/types.ts` to add `getLogGroups`, `getLogStreams` and support optional filters in `streamLogs`.
- [ ] 1.3 Update `MiniStackProvider` in `packages/runtime-sdk/src/providers/MiniStackProvider.ts` to generate mock data simulating multiple CloudWatch Log Groups and Log Streams, implementing the interface changes.
- [ ] 1.4 Update `LocalStackProvider` in `packages/runtime-sdk/src/providers/LocalStackProvider.ts` to implement the new interface methods and simulate realistic LocalStack log streams.
- [ ] 1.5 Update `AwsProvider` in `packages/runtime-sdk/src/providers/AwsProvider.ts` to implement empty stub/mock methods for the new interface additions.

## 2. Next.js Route Handlers & APIs

- [ ] 2.1 Create Route Handler `/api/logs/groups/route.ts` to list available log groups.
- [ ] 2.2 Create Route Handler `/api/logs/streams/route.ts` to list log streams for a specific group.
- [ ] 2.3 Update `/api/logs/stream/route.ts` to retrieve query parameters `logGroup` and `logStream` and pass them to the runtime provider streaming subscription.

## 3. Frontend States & Hooks

- [ ] 3.1 Update Zustand store `useLogStore` in `apps/web/store/useLogStore.ts` to support tracking active filters, log group/stream lists, and loading states.
- [ ] 3.2 Update hook `useLogStream` in `apps/web/hooks/useLogStream.ts` to support dynamic query parameters on connection and handle state refreshes when filters change.

## 4. UI Components & Pages

- [ ] 4.1 Update `LogViewer` in `packages/ui/src/components/LogViewer.tsx` to display select dropdowns for Log Group and Log Stream, populated dynamically.
- [ ] 4.2 Update Storybook preview/stories or verify Storybook loads fine with the modified component signature.
- [ ] 4.3 Update page `apps/web/app/logs/page.tsx` to handle group and stream retrieval and bind them elegantly to `LogViewer`.
