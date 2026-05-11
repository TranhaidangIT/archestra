Solution: MCP server config textarea only supports one-line-per-argume
# Repo: archestra-ai/archestra Issue #3859
# Generated: 2026-05-11

```typescript
/**
 * Parses MCP server config input, supporting both JSON and line-based formats.
 * Converts JSON arrays/objects into the expected one-argument-per-line format.
 */
export function parseMcpConfigValue(input: string): string[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  // Attempt JSON parse for catalog-paste support
  try {
    const parsed = JSON.parse(trimmed);

    // JSON array → each element becomes one line (handles ["--verbose", "8080"])
    if (Array.isArray(parsed)) {
      return parsed.map((item) =>
        typeof item === "object" && item !== null
          ? Object.entries(item)
              .map(([k, v]) => `${k}=${typeof v === "object" ? JSON.stringify(v) : v}`)
              .join(" ")
          : String(item)
      );
    }

    // JSON object → key=value pairs, one per line (handles {"port": 8080})
    if (typeof parsed === "object" && parsed !== null) {
      return Object.entries(parsed).map(([k, v]) =>
        `${k}=${typeof v === "object" ? JSON.stringify(v) : v}`
      );
    }

    return [String(parsed)];
  } catch {
    // Not JSON — use original line-based parsing
  }

  return trimmed.split("\n").map((l) => l.trim()).filter(Boolean);
}

// Usage: replace existing `input.split('\n')` with parseMcpConfigValue(input)
// Works for args, envs, and any line-delimited config field