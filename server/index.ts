import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_DOMAINS = ["gurukula.com"];
const BUCKET_NAME = "hindu-voter-awareness.firebasestorage.app";

function initFirebaseAdmin() {
  if (getApps().length > 0) return;
  initializeApp({
    storageBucket: BUCKET_NAME,
  });
}

async function verifyAdmin(authHeader: string | undefined): Promise<string | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.slice(7);
    const decoded = await getAuth().verifyIdToken(token);
    const email = decoded.email;
    if (!email) return null;
    const domain = email.split("@")[1];
    if (ADMIN_DOMAINS.includes(domain)) return email;
    const snap = await getFirestore().collection("gita_config").doc("admin_emails").get();
    if (snap.exists) {
      const data = snap.data()!;
      if ((data.emails ?? []).includes(email)) return email;
      if ((data.allowed_domains ?? []).includes(domain)) return email;
    }
    return null;
  } catch {
    return null;
  }
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  initFirebaseAdmin();

  app.post("/api/upload", express.raw({ type: "image/*", limit: "10mb" }), async (req, res) => {
    const email = await verifyAdmin(req.headers.authorization);
    if (!email) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    const imageKey = req.headers["x-image-key"] as string;
    const contentType = req.headers["content-type"] || "image/webp";
    const ext = contentType.split("/")[1] || "webp";

    if (!imageKey) {
      res.status(400).json({ error: "Missing x-image-key header" });
      return;
    }

    try {
      const bucket = getStorage().bucket();
      const storagePath = `images/${imageKey}/${Date.now()}.${ext}`;
      const file = bucket.file(storagePath);

      await file.save(req.body, {
        metadata: { contentType, cacheControl: "public, max-age=31536000" },
      });
      await file.makePublic();

      const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${storagePath}`;

      await getFirestore().collection("gita_images").doc(imageKey).set({
        url: publicUrl,
        updatedAt: new Date(),
        updatedBy: email,
      }, { merge: true });

      res.json({ url: publicUrl });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      res.status(500).json({ error: message });
    }
  });

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(
    "/assets",
    express.static(path.join(staticPath, "assets"), {
      maxAge: "1y",
      immutable: true,
    })
  );

  app.use(express.static(staticPath, { maxAge: 0 }));

  app.get("*", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
