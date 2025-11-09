//src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const fallbackLocale = "ka"; // or 'ka', depending on your default

  return {
    locale: locale ?? fallbackLocale, // ✅ Ensure it's always a string
    messages: (await import(`@/messages/${locale ?? fallbackLocale}.json`))
      .default,
  };
});
