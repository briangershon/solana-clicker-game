type Props = {
  href: string;
  text: string;
};

export default function ExternalLink({ href, text }: Props) {
  return (
    <a className="underline" target="_blank" rel="noreferrer" href={href}>
      <>{text}</>
    </a>
  );
}
