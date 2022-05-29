type Props = {
  faq: string;
  children: JSX.Element;
};

export default function FAQItem({ faq, children }: Props) {
  return (
    <div className="collapse collapse-arrow mt-3 border border-dashed border-secondary rounded-box bg-base-300">
      <input type="checkbox" />
      <div className="collapse-title text-lg font-medium">{faq}</div>
      <div className="collapse-content text-base">{children}</div>
    </div>
  );
}
