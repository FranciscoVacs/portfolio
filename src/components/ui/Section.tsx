export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <h2 className="mb-5 font-medium text-primary text-lg">{title}</h2>
      {children}
    </section>
  );
}
