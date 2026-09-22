import { ContactModal } from "@/components/contact-modal";
import { SectionShell } from "@/components/sections/section-shell";
import type { ContactSectionData } from "@/lib/cms/types";

export function ContactSection({
  section,
  index,
}: {
  section: ContactSectionData;
  index: number;
}) {
  return (
    <SectionShell id={section.id} index={index}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
          {section.heading}
        </h2>
        <p className="mt-4 text-lg text-pretty text-muted-foreground">{section.body}</p>

        <div className="mt-8 flex justify-center">
          <ContactModal triggerLabel={section.buttonLabel} size="lg" />
        </div>
      </div>
    </SectionShell>
  );
}
