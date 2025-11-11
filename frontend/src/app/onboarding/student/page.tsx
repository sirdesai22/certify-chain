"use client"

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "../../../../apps/web/src/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useUser } from "@/context/userContext";
import { InstitutionRecord } from "@/hooks/use-institutions";
import supabase from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [institutes, setInstitutes] = useState<InstitutionRecord[] | any>([]);
  const [name, setName] = useState<string | any>(user?.name);
  const [instituteId, setInstituteId] = useState<string | any>(user?.institute_id);

  const getInstitutes = async () => {
    const { data, error } = await supabase.from('institutions').select('*').eq('approved', true);
    if (error) {
      console.error(error);
    } else {
      setInstitutes(data);
      console.log(data);
    }
  }

  useEffect(() => {
    // Placeholder logic for when onboarding flow is implemented.
    // Replace this with actual onboarding checks and steps.
    // eslint-disable-next-line no-console
    getInstitutes();
    console.info("Onboarding page rendered. Implement onboarding flow here.");
  }, []);

  const handleSaveDetails = async () => {
    const { error } = await supabase.from('users').update({
      name: name,
      institute_id: instituteId,
      onboarding_completed: true,
    }).eq('id', user?.id);
    if (error) {
      console.error(error);
    } else {
      console.log("Details saved successfully");
      router.push("/student");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Onboarding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            We couldn&apos;t find your profile details yet. Please complete the onboarding
            process to start using CertChain.
          </p>
          <div className="flex flex-col gap-2 justify-center items-center">
          <Input type="text" placeholder="Name" className="w-full" value={name} onChange={(e) => setName(e.target.value)} />
          <Select value={instituteId} onValueChange={(value) => setInstituteId(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Institute" />
            </SelectTrigger>
            <SelectContent>
              {
                institutes?.map((institute: InstitutionRecord) => (
                  <SelectItem key={institute.id} value={institute.id}>{institute.name}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>

          <div className="flex justify-center">
            <Button onClick={handleSaveDetails}>Save Details</Button>
          </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

