export function getLastPathSegment(path) {
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1] || null;
}
