import NavBar from "@/components/navbar";

/**
 * Layout for the public website. Everything a visitor sees lives here, so the
 * CMS screens in the (cms) group stay free of the site header and footer.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="flex-1">{children}</main>
    </>
  );
}
