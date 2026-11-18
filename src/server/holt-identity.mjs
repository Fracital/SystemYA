export function guestIdentityResponse() {
  return new Response(JSON.stringify({ message: "Unauthorized" }), {
    status: 401,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "private, no-store",
    },
  });
}
