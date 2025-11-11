"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmployerScanPage() {
  const [isScanning, setIsScanning] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Scan Certificate QR</CardTitle>
          <CardDescription className="text-center">
            Use the built-in QR scanner to quickly validate a credential from a QR code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video w-full rounded-lg border border-dashed border-primary/40 bg-muted flex items-center justify-center text-muted-foreground">
            {isScanning ? "Camera preview placeholder" : "Tap start to begin scanning"}
          </div>
          <Button className="w-full" onClick={() => setIsScanning((prev) => !prev)}>
            {isScanning ? "Stop Scanning" : "Start Scanning"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}


