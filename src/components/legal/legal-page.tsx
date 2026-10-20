type LegalPageProps = {
  title: string;
  description: string;
  sections: {
    title: string;
    content: string;
  }[];
};

export function LegalPage({ title, description, sections }: LegalPageProps) {
  return (
    <section className="bg-[#f6f7f9] py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="surface-card p-6 sm:p-10">
          <div className="surface-content">
          <p className="eyebrow">Legal y seguridad</p>
          <h1 className="mt-3 text-3xl font-bold text-[#021623] sm:text-4xl">{title}</h1>
          <p className="mt-4 leading-7 text-[#667085]">{description}</p>
          <div className="mt-10 grid gap-8">
            {sections.map((section) => (
              <section key={section.title} className="rounded-2xl border border-[#eaecf0] bg-[#fbfcfe] p-5">
                <h2 className="text-xl font-bold text-[#021623]">{section.title}</h2>
                <p className="mt-3 leading-7 text-[#475467]">{section.content}</p>
              </section>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
