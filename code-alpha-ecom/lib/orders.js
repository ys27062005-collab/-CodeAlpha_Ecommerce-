export function normalizeOrdersPayload(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.orders)) {
    return payload.orders;
  }

  return [];
}
