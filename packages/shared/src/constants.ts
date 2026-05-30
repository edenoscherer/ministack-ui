export const RUNTIME_PROVIDERS = ['ministack', 'localstack', 'aws'] as const;

export type RuntimeProviderName = (typeof RUNTIME_PROVIDERS)[number];
