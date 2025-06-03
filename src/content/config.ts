import { defineCollection, z } from "astro:content";

const roles = defineCollection({
  type: "data",
  schema: z
    .object({
      name: z.string().describe("Role name."),
      title: z.string().describe("Human-readable role title."),
      description: z.string().describe("Brief description of the role."),
      etag: z
        .string()
        .describe("Ensures consistent read-modify-write operations."),
      deleted: z.boolean().describe("Role Deleted or not"),
      included_permissions: z
        .array(z.string().describe("A permission granted by the role."))
        .describe(
          "Permissions granted when this role is bound in an IAM policy."
        ),
      stage: z.string().describe("Current launch stage of the role."),
    })
    .describe(
      "Defines a GCP IAM Role, which grants specific permissions for Google Cloud resources."
    ),
});

export const collections = {
  roles: roles,
};
