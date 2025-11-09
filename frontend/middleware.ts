// middleware.ts
import createMiddleware from "next-intl/middleware";
import i18n from "./i18n"; // Ensure this path is correct

export default createMiddleware(i18n);

export const config = {
  matcher: ["/", "/(en|ka)/:path*"], // Make sure this covers all necessary locale routes
};
