"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);

  const handleToggleScan = () => {
    setIsScanning((prev) => !prev);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Scan QR Code</CardTitle>
          <CardDescription className="text-center">
            Use your device camera to scan certificate QR codes and verify them instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video w-full rounded-lg border border-dashed border-primary/40 bg-muted flex items-center justify-center text-muted-foreground">
            {isScanning ? "Camera preview loading..." : "Camera feed will appear here"}
          </div>
          <Button className="w-full" onClick={handleToggleScan}>
            {isScanning ? "Stop Scanning" : "Start Scanning"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}


