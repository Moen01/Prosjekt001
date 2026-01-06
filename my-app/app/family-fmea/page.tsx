import { Sora } from "next/font/google";
import FamilyFmeaClient from "./components/family-fmea-client/family-fmea-client";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface FamilyFmeaPageProps {
  searchParams?: {
    familyId?: string;
    familyCode?: string;
    title?: string;
  };
}

// Family FMEA flow entry point (server wrapper for fonts + params).
export default function FamilyFmeaPage({ searchParams }: FamilyFmeaPageProps) {
  return (
    <div className={sora.className}>
      <FamilyFmeaClient
        initialFamilyId={searchParams?.familyId}
        initialFamilyCode={searchParams?.familyCode ?? searchParams?.title}
      />
    </div>
  );
}
