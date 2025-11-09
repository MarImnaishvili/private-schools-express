import { getTranslations } from "next-intl/server";
import SchoolsList from "@/components/SchoolsList";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tGeneral = await getTranslations({ locale, namespace: "General" });

  // Fetch schools from the API
  let schools = [];
  try {
    const response = await fetch(`${API_URL}/api/schools`, {
      cache: 'no-store', // Don't cache for now, fetch fresh data each time
    });

    if (response.ok) {
      schools = await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch schools:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 mb-6 md:mb-10 mt-4 md:mt-8 shadow-md border border-gray-200">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
          {tGeneral("aboutOurPlatform")}
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
          {tGeneral("welcomeText")}
        </p>
      </div>

        {/* Schools List with Filters */}
        <SchoolsList schools={schools} />
      </div>
    </div>
  );
}
