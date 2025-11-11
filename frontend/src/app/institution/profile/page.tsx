"use client";

import { useUser } from "@/context/userContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function InstitutionProfilePage() {
  const { user, loading } = useUser();

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Institution Profile</CardTitle>
            <CardDescription>
              Maintain verified information about your institution to build trust with students and employers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p className="text-muted-foreground">Loading profile...</p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="institutionName">Institution Name</Label>
                  <Input
                    id="institutionName"
                    defaultValue={user?.name ?? ""}
                    placeholder="Enter the official institution name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institutionEmail">Contact Email</Label>
                  <Input
                    id="institutionEmail"
                    type="email"
                    defaultValue={user?.email ?? ""}
                    placeholder="contact@institution.edu"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    defaultValue={user?.address ?? ""}
                    placeholder="Enter the physical address or headquarters location"
                    rows={4}
                  />
                </div>
                <Button className="w-full">Save Changes</Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


