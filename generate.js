import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);

const iam = google.iam("v1");

/**
 * @typedef {Object} Role
 * @property {string} name
 * @property {string} title
 * @property {string} description
 * @property {string} etag
 * @property {boolean} deleted
 * @property {string[]} included_permissions
 * @property {string} stage
 * @property {number} [permissionCount]
 */

/**
 * Crawls IAM roles, fetches their details, and saves them as JSON files.
 * @returns {Promise<void>}
 */
async function crawlRoles() {
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  google.options({ auth });

  const iamDir = "src/content/roles";

  const roles = await listAllRoles();
  for (const role of roles) {
    const detailedRole = await getRoleDetails(role.name);
    const filename = role.name.replace(/^roles\//g, "") + ".json";
    const filePath = path.join(iamDir, filename);
    await writeFile(filePath, JSON.stringify(detailedRole, null, 2));
    console.log(`Successfully saved role ${role.name} to ${filePath}`);
  }

  console.log(
    `Crawl completed. Check the '${iamDir}' directory for detailed JSON files.`
  );
}

/**
 * Lists all available IAM roles.
 * @returns {Promise<Array<Role>>} A promise that resolves to an array of Role objects.
 */
async function listAllRoles() {
  /** @type {Array<Role>} */
  let allRoles = [];
  let pageToken = "";

  do {
    const res = await iam.roles.list({
      pageToken,
      showDeleted: false,
    });

    if (res.data.roles) {
      allRoles = allRoles.concat(
        /** @type {Array<Role>} */ (
          res.data.roles.map((r) => ({
            name: r.name || "",
            title: r.title || "",
            description: r.description || "",
            deleted: r.deleted || false,
            etag: r.etag || "",
            included_permissions: r.includedPermissions || [],
            stage: r.stage || "",
          }))
        )
      );
    }

    pageToken = res.data.nextPageToken || "";
  } while (pageToken);

  return allRoles;
}

/**
 * Gets the detailed information for a specific IAM role.
 * @param {string} roleName - The full name of the role (e.g., "roles/viewer").
 * @returns {Promise<Role>} A promise that resolves to a detailed Role object.
 */
async function getRoleDetails(roleName) {
  const res = await iam.roles.get({ name: roleName });
  const role = res.data;
  return {
    name: role.name || "",
    title: role.title || "",
    description: role.description || "",
    etag: role.etag || "",
    deleted: role.deleted || false,
    included_permissions: role.includedPermissions || [],
    stage: role.stage || "",
  };
}

/**
 * Main function to initiate the role crawling process.
 * @returns {Promise<void>}
 */
async function main() {
  return await crawlRoles();
}

main().catch(console.error);
