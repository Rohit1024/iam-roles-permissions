// src/components/RoleDetailPage.tsx
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Search } from "lucide-react";
import { toast } from "sonner";
import type { CollectionEntry } from "astro:content";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RoleDetailPageProps {
  role: CollectionEntry<"roles">;
}

const RoleDetailPage: React.FC<RoleDetailPageProps> = ({ role }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPermissions = useMemo(() => {
    if (!searchTerm) return role.data.included_permissions;

    const lowercaseSearch = searchTerm.toLowerCase();
    return role.data.included_permissions.filter((permission) =>
      permission.toLowerCase().includes(lowercaseSearch)
    );
  }, [searchTerm, role.data.included_permissions]);

  const handleCopyRole = () => {
    navigator.clipboard
      .writeText(role.data.name)
      .then(() => {
        toast.success("Role Copied", {
          description: "Role name copied to clipboard",
        });
      })
      .catch((err) => {
        console.error("Failed to copy role name: ", err);
        toast("Copy Failed", { description: "Unable to copy role name" });
      });
  };

  return (
    <main className="flex-1 container mx-auto px-4 pt-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="font-mono">{role.data.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyRole}
              aria-label="Copy Role"
            >
              <Copy className="h-5 w-5" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-[auto_1fr] gap-2">
              <p className="font-semibold">Title:</p>
              <p className="text-muted-foreground">{role.data.title}</p>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-2">
              <p className="font-semibold">Description:</p>
              <p className="text-muted-foreground">{role.data.description}</p>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-2">
              <p className="font-semibold">Stage:</p>
              <Badge variant="secondary" className="inline-flex w-auto">
                {role.data.stage}
              </Badge>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">
              {role.data.included_permissions.length} Assigned Permissions:
            </h2>

            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Filter permissions..."
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
                <div key={permission} className="py-2 border-b last:border-b-0">
                  <a
                    href={`/permissions/${permission}`}
                    className="text-primary hover:underline font-mono"
                  >
                    {permission}
                  </a>
                </div>
              ))}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default RoleDetailPage;