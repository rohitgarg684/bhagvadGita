import { google } from "googleapis";
import { readFileSync } from "fs";
import { resolve } from "path";
import { homedir } from "os";

const home = homedir();
const serviceAccount = JSON.parse(
  readFileSync(resolve(home, "Downloads/hindu-voter-awareness-firebase-adminsdk-fbsvc-5b79d9435b.json"), "utf-8")
);

const projectId = serviceAccount.project_id;

async function deployRules() {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/firebase", "https://www.googleapis.com/auth/cloud-platform"],
  });

  const client = await auth.getClient();
  const token = (await client.getAccessToken()).token;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const firestoreRules = readFileSync(resolve(process.cwd(), "firestore.rules"), "utf-8");
  console.log("Firestore rules to deploy:\n", firestoreRules);

  // Step 1: Create a new ruleset
  const createRes = await fetch(
    `https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        source: {
          files: [{ name: "firestore.rules", content: firestoreRules }],
        },
      }),
    }
  );

  if (!createRes.ok) {
    const err = await createRes.text();
    console.error("Create ruleset failed:", createRes.status, err);
    process.exit(1);
  }

  const ruleset = await createRes.json();
  const rulesetName = ruleset.name;
  console.log("Created ruleset:", rulesetName);

  // Step 2: Release the ruleset to cloud.firestore
  const releaseName = `projects/${projectId}/releases/cloud.firestore`;

  // Try update first (PATCH), fall back to create (POST)
  let releaseRes = await fetch(
    `https://firebaserules.googleapis.com/v1/${releaseName}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        release: { name: releaseName, rulesetName },
      }),
    }
  );

  if (!releaseRes.ok && releaseRes.status === 404) {
    releaseRes = await fetch(
      `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: releaseName,
          rulesetName,
        }),
      }
    );
  }

  if (!releaseRes.ok) {
    const err = await releaseRes.text();
    console.error("Release failed:", releaseRes.status, err);
    process.exit(1);
  }

  const release = await releaseRes.json();
  console.log("Firestore rules deployed successfully!");
  console.log("Release:", JSON.stringify(release, null, 2));
}

deployRules().catch((err) => {
  console.error("Failed:", err.message || err);
  process.exit(1);
});
