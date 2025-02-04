// src/components/PermissionsPage.tsx
import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import type { CollectionEntry } from "astro:content";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PermissionsPageProps {
  initialPermissions: string[];
  roles: CollectionEntry<"roles">[];
}

const PermissionsPage: React.FC<PermissionsPageProps> = ({
  initialPermissions,
  roles,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPermissions = useMemo(() => {
    if (!searchTerm) return initialPermissions;

    const lowercaseSearch = searchTerm.toLowerCase();
    return initialPermissions.filter((permission) =>
      permission.toLowerCase().includes(lowercaseSearch)
    );
  }, [searchTerm, initialPermissions]);

  const getPermissionRoleCount = (permission: string) => {
    return roles.filter((role) =>
      role.data.included_permissions.includes(permission)
    ).length;
  };

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
                <Badge>{getPermissionRoleCount(permission)} roles</Badge>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </main>
  );
};

export default PermissionsPage;