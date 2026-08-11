export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16">
      <h2 className="mb-6 text-[1.7rem] text-primary leading-tight">{title}</h2>
      {children}
    </section>
  );
}
