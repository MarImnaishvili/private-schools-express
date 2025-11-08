// components/ui/Label.tsx
export function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block mb-1 font-medium text-gray-700">
      {children}
    </label>
  );
}
