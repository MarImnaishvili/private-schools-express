// app/page.tsx
import { redirect } from "next/navigation";

export default function RootRedirect() {
  redirect("/en"); // Default to English
}
