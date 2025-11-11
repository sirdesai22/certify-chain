"use client";

import { useUser } from "@/context/userContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StudentProfilePage() {
  const { user, loading } = useUser();

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Profile</CardTitle>
            <CardDescription>Review and update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p className="text-muted-foreground">Loading profile...</p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name ?? ""} placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email ?? ""} placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wallet">Wallet Address</Label>
                  <Input
                    id="wallet"
                    defaultValue={user?.wallet_address ?? ""}
                    placeholder="0x..."
                    disabled
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


