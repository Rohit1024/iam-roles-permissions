export type Site = {
    TITLE: string;
    DESCRIPTION: string;
    SITEURL: string;
    LOGO: string;
  };
  
  export type Link = {
    href: string;
    label: string;
  };
  
  export const SITE: Site = {
    TITLE: "IAM Roles and Permissions",
    DESCRIPTION:
      "GCP-IAM-Roles-and-permissions is an independent tool designed to simplify the exploration of Google Cloud Platform (GCP) Identity and Access Management (IAM) predefined roles and permissions. This tool is not affiliated with or endorsed by Google.",
    SITEURL: "http://localhost:4321",
    LOGO: "iam-roles-permissions/public/identity_and_access_management.png",
  };
  
  export const NAV_LINKS: Link[] = [
    { href: "/roles", label: "roles" },
    { href: "/permissions", label: "permissions" },
    { href: "/craft", label: "craft custom role" },
  ];
  
  export const FOOTER = {
    label: "GCP-IAM-Roles-and-permissions. All rights reserved.",
  };