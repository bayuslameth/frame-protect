# FIX — Hydration Mismatch on /app/detect

## Root Cause

The React hydration mismatch appeared on `/app/detect` with this error:

```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.

<button disabled={null}>   ← server render
<button disabled={true}>   ← client render
```

### Why it happened — two layers

**Layer 1: `detect/page.tsx` — unstable `useState` initialization**

```ts
// BEFORE (broken)
const [secretKey, setSecretKey] = useState(baselineContext?.secretKey || "");
const [originalText, setOriginalText] = useState(baselineContext?.watermarkText || "");
```

`baselineContext` is provided by `WorkflowProvider`, which is a client-only React context. During **server-side rendering**, `baselineContext` is always `null`, so both values initialize to `""`.

When Next.js **hydrates on the client**, React re-runs the component. If a previous Protect session has stored `baselineContext.secretKey` in React in-memory state (from navigating Protect → Detect in the same session), the useState initializers pick up a non-empty string.

This causes:
- Server: `secretKey = ""` → `!secretKey = true` → `isDetectDisabled = true` → `disabled={true}`
- Client: `secretKey = "my-secret"` → `!secretKey = false` → `isDetectDisabled = false` → `disabled={null}` (React omits falsy disabled) or `disabled={false}`

→ **Mismatch.**

**Layer 2: `button.tsx` — `disabled` not normalized**

The `Button` component spread `...props` without normalizing `disabled`, meaning `disabled={undefined}` or `disabled={false}` from the caller could reach the DOM differently on server vs. client.

---

## Fix

### `frontend/app/app/detect/page.tsx`

Initialize state with a **stable constant** (`""`) that is identical on both server and client. After hydration, sync values from `baselineContext` via `useEffect`:

```ts
// AFTER (fixed)
const [secretKey, setSecretKey] = useState("");       // stable: always "" on server AND client
const [originalText, setOriginalText] = useState(""); // stable: always "" on server AND client

// Post-hydration sync — runs only on client, after React has finished reconciliation
useEffect(() => {
  if (baselineContext?.secretKey) setSecretKey(baselineContext.secretKey);
  if (baselineContext?.watermarkText) setOriginalText(baselineContext.watermarkText);
}, [baselineContext]);
```

This guarantees:
- Server renders: `disabled={true}` (secretKey = "", asset = null)
- Client renders: `disabled={true}` (same initial state)
- After hydration: `useEffect` updates secretKey from context → the button may become enabled, but this is a post-hydration state update (not a mismatch)

### `frontend/components/ui/button.tsx`

Explicitly destructure `disabled` from props and normalize it to a strict boolean before rendering:

```tsx
// AFTER (fixed)
export function Button({ ..., disabled, ...props }) {
  return (
    <button
      disabled={Boolean(disabled)}  // always true or false, never null/undefined
      {...props}
    >
```

This ensures the `disabled` DOM attribute is always deterministic regardless of what the caller passes.

---

## Files Changed

| File | Change |
|---|---|
| `frontend/app/app/detect/page.tsx` | `useState("")` + `useEffect` sync instead of reading `baselineContext` at init time |
| `frontend/components/ui/button.tsx` | Destructure `disabled`, apply `Boolean()` normalization before spreading |

---

## Validation

- `npm run build`: **PASS** — Zero TypeScript errors, all 7 routes compiled
- TypeScript check: **PASS**
- No `suppressHydrationWarning` added
- No SSR disabling
- No `window`/`document` checks in render
- No `setTimeout` hacks

## Functional Safety

- Detect button remains **disabled** on initial page load (no image + no key)
- Detect button becomes **enabled** after uploading an image and entering a key
- If arriving from Protect workflow, the `useEffect` prefill syncs key and reference text after hydration with no visible flicker
- `handleDetect` logic is completely unchanged
- All detection API calls unchanged
