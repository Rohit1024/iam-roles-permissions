import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Search } from "lucide-react";
import { toast } from "sonner";
import type { CollectionEntry } from "astro:content";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface PermissionDetailPageProps {
  permission: string;
  roles: CollectionEntry<"roles">[];
}

const PermissionDetailPage: React.FC<PermissionDetailPageProps> = ({
  permission,
  roles,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = useMemo(() => {
    if (!searchTerm) return roles;

    const lowercaseSearch = searchTerm.toLowerCase();
    return roles.filter((role) =>
      role.data.name.toLowerCase().includes(lowercaseSearch)
    );
  }, [searchTerm, roles]);

  const handleCopyPermission = () => {
    navigator.clipboard
      .writeText(permission)
      .then(() => {
        toast.success("Permission Copied", {
          description: "Permission name copied to clipboard",
        });
      })
      .catch((err) => {
        console.error("Failed to copy permission: ", err);
        toast("Copy Failed", { description: "Unable to copy permission name" });
      });
  };

  return (
    <main className="flex-1 container mx-auto px-4 pt-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge
              variant={"secondary"}
              id="permission-id"
              className="font-mono font-bold text-lg"
            >
              {permission}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyPermission}
              aria-label="Copy Permission"
            >
              <Copy className="h-5 w-5" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <h2 className="font-semibold mb-4">
            <Badge className="mx-2">{roles.length}</Badge>Roles Assign this
            Permission:
          </h2>

          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="Search for specific roles..."
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
            {filteredRoles.map((role) => (
              <div key={role.id} className="py-2 border-b last:border-b-0">
                <a
                  href={`/roles/${role.id}`}
                  className="font-mono text-primary hover:underline"
                >
                  {role.data.name}
                </a>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </main>
  );
};

export default PermissionDetailPage;
