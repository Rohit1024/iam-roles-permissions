// src/components/RolesPage.tsx
import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import type { CollectionEntry } from "astro:content";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RolesPageProps {
  initialRoles: CollectionEntry<"roles">[];
}

const RolesPage: React.FC<RolesPageProps> = ({ initialRoles }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = useMemo(() => {
    if (!searchTerm) return initialRoles;

    const lowercaseSearch = searchTerm.toLowerCase();
    return initialRoles.filter(
      (role) =>
        role.data.name.toLowerCase().includes(lowercaseSearch) ||
        role.data.title.toLowerCase().includes(lowercaseSearch)
    );
  }, [searchTerm, initialRoles]);

  return (
    <main className="flex-1 w-full container mx-auto px-4 pt-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            All GCP IAM Roles{" "}
            <span className="ml-2 text-muted-foreground">
              ({initialRoles.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="Search for roles or titles..."
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
              <div
                key={role.id}
                className="flex justify-between items-center py-2 border-b last:border-b-0"
              >
                <a
                  href={`/roles/${role.id}`}
                  className="font-mono text-primary hover:underline"
                >
                  {role.data.name}
                </a>
                <span className="text-muted-foreground">{role.data.title}</span>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </main>
  );
};

export default RolesPage;
