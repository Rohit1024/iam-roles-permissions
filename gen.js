import { google } from "googleapis"
import * as fs from "fs"
import * as path from "path"
import { promisify } from "util"

const writeFile = promisify(fs.writeFile)

const iam = google.iam("v1")

async function crawlRoles() {
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"]
  })

  google.options({ auth })

  const iamDir = "src/content/roles"

  const roles = await listAllRoles()
  for (const role of roles) {
    const detailedRole = await getRoleDetails(role.name)
    const filename = role.name.replace(/^roles\//g, "") + ".json"
    const filePath = path.join(iamDir, filename)
    await writeFile(filePath, JSON.stringify(detailedRole, null, 2))
    console.log(`Successfully saved role ${role.name} to ${filePath}`)
  }

  console.log(
    `Crawl completed. Check the '${iamDir}' directory for detailed JSON files.`
  )
}

async function listAllRoles() {
  let allRoles = []
  let pageToken = ""

  do {
    const res = await iam.roles.list({
      pageToken,
      showDeleted: false
    })

    if (res.data.roles) {
      allRoles = allRoles.concat(
        res.data.roles.map(r => ({
          name: r.name || "",
          title: r.title || "",
          description: r.description || "",
          deleted: r.deleted || false,
          etag: r.etag || "",
          included_permissions: r.includedPermissions || [],
          stage: r.stage || ""
        }))
      )
    }

    pageToken = res.data.nextPageToken || ""
  } while (pageToken)

  return allRoles
}

async function getRoleDetails(roleName) {
  const res = await iam.roles.get({ name: roleName })
  const role = res.data
  return {
    name: role.name || "",
    title: role.title || "",
    description: role.description || "",
    etag: role.etag || "",
    deleted: role.deleted || false,
    included_permissions: role.includedPermissions || [],
    stage: role.stage || ""
  }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.includes("--crawl")) {
    await crawlRoles()
  } else {
    console.log("Please specify --crawl")
  }
}

main().catch(console.error)
