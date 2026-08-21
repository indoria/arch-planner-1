# TypeScript Style Guide

- Enable strict mode and no unchecked external input.
- Keep schemas at API and file boundaries; infer types from validated data.
- Use discriminated unions for node, event, diagnostic, and report variants.
- Keep domain packages free of DOM, NestJS, and MongoDB imports.
- Prefer named exports, explicit return types on public functions, and immutable
  updates for state transitions.
