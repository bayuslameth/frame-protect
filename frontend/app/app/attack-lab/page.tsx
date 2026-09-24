import React from "react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";
import { AttackPalette } from "@/components/attack/attack-palette";
import { ContactSheetPreview } from "@/components/preview/contact-sheet-preview";
import { Button } from "@/components/ui/button";

export default function AttackLabPage() {
  return (
    <PlaceholderPage
      pageName="Image Attack Laboratory"
      description="Subject frames to signal distortions to evaluate watermark survival."
      routePath="/app/attack-lab"
    >
      <div className="space-y-12">
        <WorkflowStepper currentStepId="attack" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-8">
            <AttackPalette />
            
            <div className="flex gap-4">
               <Button variant="primary" size="lg" className="w-full">
                 Simulate Attack
               </Button>
               <Button variant="outline" size="lg" className="w-full">
                 Run Full Suite
               </Button>
            </div>
            <p className="text-center font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
              Processing engine offline
            </p>
          </div>
          
          <div className="sticky top-24">
            <ContactSheetPreview
               leftTitle="Source Image"
               rightTitle="Degraded Image"
            />
          </div>
        </div>
      </div>
    </PlaceholderPage>
  );
}
