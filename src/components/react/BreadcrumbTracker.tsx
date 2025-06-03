import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface BreadcrumbSegment {
  name: string;
  path: string;
}

interface BreadcrumbTrackerProps {
  currentPath: string;
  customLabels?: Record<string, string>; // Optional custom labels for specific paths
}

// Route configuration for better naming
const ROUTE_LABELS: Record<string, string> = {
  roles: "roles",
  permissions: "permissions",
};

// Helper function to get display name for a path segment
function getSegmentDisplayName(
  segment: string,
  customLabels?: Record<string, string>
): string {
  // Check custom labels first
  if (customLabels && customLabels[segment]) {
    return customLabels[segment];
  }

  // Check predefined route labels
  if (ROUTE_LABELS[segment]) {
    return ROUTE_LABELS[segment];
  }

  // Handle dynamic routes (remove brackets and decode URI)
  const cleanSegment = segment.replace(/\[|\]/g, "");
  const decodedSegment = decodeURIComponent(cleanSegment);

  // Format the segment: capitalize and replace separators with spaces
  return decodedSegment
    .split(/[-_]/)
    .map((word) => word.charAt(0) + word.slice(1))
    .join(" ");
}

export function BreadcrumbTracker({
  currentPath,
  customLabels,
}: BreadcrumbTrackerProps) {
  const paths = currentPath.split("/").filter((p) => p);

  const segments: BreadcrumbSegment[] = [{ name: "Home", path: "/" }];

  let currentSegmentPath = "";
  paths.forEach((path) => {
    currentSegmentPath += `/${path}`;

    const displayName = getSegmentDisplayName(path, customLabels);

    segments.push({
      name: displayName,
      path: currentSegmentPath,
    });
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {index === segments.length - 1 ? (
                <BreadcrumbPage className="font-medium text-foreground">
                  {segment.name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={segment.path}
                  className="transition-colors hover:text-foreground"
                >
                  {segment.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < segments.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// TODO: Add BreadcrumbTracker to application in future
// This component can be used in the main layout or specific pages to track navigation
// Example usage:
// <BreadcrumbTracker currentPath="/roles/123" customLabels={{ roles: "User Roles" }} />
