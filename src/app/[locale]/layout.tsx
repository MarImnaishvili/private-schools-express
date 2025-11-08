import { NextIntlClientProvider } from "next-intl";
import Header from "@/components/Header";
import { AuthProvider } from "@/contexts/AuthContext";
import "../globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex flex-row">
            <main className="flex-1 pt-16">{children}</main>
          </div>
        </div>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
