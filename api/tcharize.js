const tcharizeApiUrl = process.env.TCHARIZE_API_URL || "https://tcharizeapi-production.up.railway.app";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "Use POST for translation." });
  }
  if (!process.env.TCHARIZE_API_KEY) {
    return response.status(503).json({ message: "Tcharize is not configured for this site." });
  }

  try {
    const upstream = await fetch(`${tcharizeApiUrl.replace(/\/$/, "")}/api/v1/localization/page`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TCHARIZE_API_KEY}`,
      },
      body: JSON.stringify(request.body),
      signal: AbortSignal.timeout(180_000),
    });
    const body = await upstream.text();
    response.status(upstream.status);
    response.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    return response.send(body);
  } catch {
    return response.status(502).json({ message: "Tcharize could not translate this page." });
  }
}
