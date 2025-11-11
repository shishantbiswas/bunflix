import sharp from "sharp";

/** Convert "HH:MM:SS.mmm" → seconds */
function parseTimestamp(ts: string) {
  const p = ts.trim().split(":").map(Number);
  if (p.length === 3) return p[0] * 3600 + p[1] * 60 + p[2];
  if (p.length === 2) return p[0] * 60 + p[1];
  return Number(p[0]);
}

/** Parse a WebVTT text into cue objects */
function parseVtt(vttText: string) {
  const lines = vttText
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const cues = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip "WEBVTT" header or region/style blocks
    if (
      /^WEBVTT/i.test(line) ||
      line.startsWith("NOTE") ||
      line.startsWith("STYLE")
    ) {
      i++;
      continue;
    }

    // Skip numeric cue index (e.g. "132")
    if (/^\d+$/.test(line)) {
      i++;
      continue;
    }

    // Expect timing line
    if (line.includes("-->")) {
      const [startRaw, endRaw] = line.split("-->").map((s) => s.trim());
      const start = parseTimestamp(startRaw);
      const end = parseTimestamp(endRaw);

      // Next non-empty line should be the image URL
      let cueText = "";
      i++;
      while (
        i < lines.length &&
        lines[i] &&
        !lines[i].includes("-->") &&
        !/^\d+$/.test(lines[i])
      ) {
        cueText = lines[i];
        i++;
        break;
      }

      const m = cueText.match(/(\S+?)(?:#xywh=(\d+),(\d+),(\d+),(\d+))?$/);
      if (m) {
        const url = m[1];
        const xywh = m[2] ? { x: +m[2], y: +m[3], w: +m[4], h: +m[5] } : null;
        cues.push({ start, end, url, xywh });
      }
      continue;
    }

    i++;
  }

  return cues;
}

interface Cue {
  start: any;
  end: any;
  url: string;
  xywh: {
    x: number;
    y: number;
    w: number;
    h: number;
  } | null;
}

/** Find cue covering the given time */
function findCue(cues: Cue[], t: number) {
  return cues.find((c) => t >= c.start && t < c.end);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vttUrl = searchParams.get("vtt");
    const time = Number(searchParams.get("t")) ?? 10;

    if (!vttUrl || isNaN(time))
      return new Response("Missing ?vtt or ?t", { status: 400 });

    // Fetch and parse WebVTT
    const vttRes = await fetch(vttUrl);
    if (!vttRes.ok) throw new Error(`Failed to fetch VTT: ${vttRes.status}`);
    const vttText = await vttRes.text();
    const cues = parseVtt(vttText);
    console.log(cues);

    const cue = findCue(cues, time);
    if (!cue) return new Response("No cue found", { status: 404 });

    // Resolve relative URLs against the VTT file location
    const imageUrl = new URL(cue.url, vttUrl).toString();

    // Fetch sprite image

    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) throw new Error(`Failed to fetch image: ${imgRes.status}`);
    const imgArrayBuf = await imgRes.arrayBuffer();
    const imgBuf = Buffer.from(imgArrayBuf);

    // Crop using xywh if present
    let image = sharp(imgBuf);
    if (cue.xywh) {
      const { x, y, w, h } = cue.xywh;
      image = image.extract({ left: x, top: y, width: w, height: h });
    }

    const output = await image.png().toBuffer();

    return new Response("output", {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    return Response.json((err instanceof Error) ? err.message : "Error", { status: 500 });
  }
}
