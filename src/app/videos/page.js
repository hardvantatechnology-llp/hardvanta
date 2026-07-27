import InfoPage, { Section } from "@/components/layout/InfoPage";

export const metadata = { title: "Videos — HV KART" };

export default function VideosPage() {
  return (
    <InfoPage
      title="Videos"
      intro="Tutorials, project builds, and product walkthroughs to help you make the most of your components."
    >
      <Section heading="Coming soon">
        <p>
          We&apos;re putting together a library of how-to videos and project
          guides. In the meantime, follow us on YouTube and Instagram for the
          latest tutorials and build ideas.
        </p>
      </Section>
    </InfoPage>
  );
}
