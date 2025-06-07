"use server";
import { History } from "@/context/show-provider";
import { spawn } from "node:child_process";
import { unlink, writeFile } from "node:fs/promises";
import { mkdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { pipeline } from "node:stream";
import { createWriteStream } from "node:fs";
import https from "node:https";
import { pathToFileURL } from "node:url";
import os from "node:os";

export default async function DownloadVideo(
  src: string,
  show: History,
  lang: string,
  sub?: string
) {
  const unsafeName = `${show.epNum} ${show.data.anime.info.name} ${lang}`;
  const sanitizedName = sanitizeName(unsafeName);

  const downloadDir = path.join(tmpdir(), "downloads");

  if (!existsSync(downloadDir)) {
    mkdirSync(downloadDir);
  }

  const outputPath = path.join(downloadDir, `${sanitizedName}.mp4`);
  const subtitlePath = path.join(downloadDir, `${sanitizedName}.vtt`);
  const finalOutputPath = path.join(
    os.homedir(),
    "Downloads",
    `${sanitizedName}_subbed.mp4`
  );

  // 1. Download the video using yt-dlp
  await new Promise<void>((resolve, reject) => {
    const ytProcess = spawn("yt-dlp", [
      "-N",
      "8",
      "-R",
      "24",
      "--no-warnings",
      "--add-headers",
      "Referer:https://megacloud.club/",
      "-o",
      outputPath,
      src,
    ]);

    ytProcess.stdout.on("data", (data) => {
      console.log(`yt-dlp stdout: ${data}`);
    });

    ytProcess.stderr.on("data", (data) => {
      console.error(`yt-dlp stderr: ${data}`);
    });

    ytProcess.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`yt-dlp exited with code ${code}`));
    });
  });

  if (!sub || lang == "en") {
    console.log(`Final video saved at : ${finalOutputPath}`);
    return;
  }
  // 2. Download the subtitle file from URL
  await new Promise<void>((resolve, reject) => {
    const request = https.get(sub, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch subtitle: ${response.statusCode}`));
        return;
      }

      const fileStream = createWriteStream(subtitlePath);
      response.pipe(fileStream);

      fileStream.on("finish", () => {
        fileStream.close();
        resolve();
      });

      fileStream.on("error", reject);
    });

    request.on("error", reject);
  });

  // 3. Merge subtitle into video using ffmpeg
  await new Promise<void>((resolve, reject) => {
    const ffmpegProcess = spawn("ffmpeg", [
      "-i",
      outputPath,
      "-i",
      subtitlePath,
      "-c",
      "copy",
      "-scodec",
      "mov_text",
      finalOutputPath,
    ]);

    ffmpegProcess.stdout.on("data", (data) => {
      console.log(`ffmpeg stdout: ${data}`);
    });

    ffmpegProcess.stderr.on("data", (data) => {
      console.error(`ffmpeg stderr: ${data}`);
    });

    ffmpegProcess.on("close", async (code) => {
      if (code === 0) {
        console.log("Subtitles merged successfully.");
        try {
          await unlink(outputPath); // Delete original video
          await unlink(subtitlePath); // Delete subtitle
          console.log("Temporary files cleaned up.");
        } catch (err) {
          console.error("Cleanup failed:", err);
        }

        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });
  });

  console.log(`Final video with subtitles: ${finalOutputPath}`);
}

function escapeForFFmpegFilterPath(p: string): string {
  return p
    .replace(/:/g, "\\:")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/!/g, "\\!")
    .replace(/,/g, "\\,");
}

function sanitizeName(name: string): string {
  return name
    .replace(/[^\w\s]/gi, "") // Remove anything that's not a word character or space
    .replace(/\s+/g, " ") // Normalize multiple spaces
    .trim(); // Remove leading/trailing spaces
}
