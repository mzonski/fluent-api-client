export type Union<T> = T extends object ? { [K in keyof T]: T[K] } : never;

export type OverrideType<TObj extends object, TKey extends keyof TObj, TType> = TObj & { [K in TKey]: TType };
