import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { readFileSync } from "fs";
import { resolve } from "path";
import { homedir } from "os";

const home = homedir();

const serviceAccount = JSON.parse(
  readFileSync(resolve(home, "Downloads/hindu-voter-awareness-firebase-adminsdk-fbsvc-5b79d9435b.json"), "utf-8")
);

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "hindu-voter-awareness.firebasestorage.app",
});

const bucket = getStorage(app).bucket();

async function setCors() {
  await bucket.setCorsConfiguration([
    {
      origin: ["*"],
      method: ["GET", "HEAD"],
      responseHeader: [
        "Content-Type",
        "Content-Length",
        "Content-Range",
        "Accept-Ranges",
      ],
      maxAgeSeconds: 86400,
    },
  ]);
  console.log("CORS configuration set on bucket:", bucket.name);
}

setCors().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
