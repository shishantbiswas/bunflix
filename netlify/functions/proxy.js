export async function handler(event) {
  const url = decodeURIComponent(
    event.path.replace("/.netlify/functions/proxy/", "")
  );

  try {
    const response = await fetch(url, {
      headers: { Referer: "https://megacloud.club/" },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: response.statusText }),
      };
    }

    const data = await response.arrayBuffer();
    return {
      statusCode: 200,
      headers: {
        "Referer": "http://localhost:3000/",
        "Content-Type":
          response.headers.get("Content-Type") || "application/octet-stream",
      },
      body: Buffer.from(data).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error }) };
  }
}
