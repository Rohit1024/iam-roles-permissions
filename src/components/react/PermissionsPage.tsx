// src/components/PermissionsPage.tsx
import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import type { CollectionEntry } from "astro:content";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/use-debounce";

interface PermissionsPageProps {
  initialPermissions: string[];
  roles: CollectionEntry<"roles">[];
}

const PermissionsPage: React.FC<PermissionsPageProps> = ({
  initialPermissions,
  roles,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce with 300ms delay

  // 1. Pre-calculate role counts:  This is the KEY optimization
  const permissionRoleCounts = useMemo(() => {
    const counts: { [permission: string]: number } = {};
    initialPermissions.forEach((permission) => (counts[permission] = 0)); // Initialize all counts to zero.
    roles.forEach((role) => {
      role.data.included_permissions.forEach((permission) => {
        if (counts[permission] !== undefined) {
          // Check if permission is in the initial list.
          counts[permission]++;
        }
      });
    });
    return counts;
  }, [roles, initialPermissions]);

  const filteredPermissions = useMemo(() => {
    if (!debouncedSearchTerm) return initialPermissions;
    const lowercaseSearch = debouncedSearchTerm.toLowerCase();
    return initialPermissions.filter((permission) =>
      permission.toLowerCase().includes(lowercaseSearch)
    );
  }, [debouncedSearchTerm, initialPermissions]);

  return (
    <main className="flex-1 container mx-auto px-4 pt-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            All GCP Permissions{" "}
            <span className="ml-2 text-muted-foreground">
              ({initialPermissions.length})
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="Search for specific permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
          </div>

          <ScrollArea className="bg-secondary rounded-sm border p-4 h-[600px]">
            {filteredPermissions.map((permission) => (
              <div
                key={permission}
                className="flex justify-between items-center py-2 border-b last:border-b-0"
              >
                <a
                  href={`/permissions/${permission}`}
                  className="font-mono text-primary hover:underline"
                >
                  {permission}
                </a>
                <Badge>{permissionRoleCounts[permission] || 0} roles</Badge>{" "}
                {/* Access pre-calculated count */}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </main>
  );
};

export default PermissionsPage;
