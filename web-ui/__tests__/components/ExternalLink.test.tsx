import { render, screen } from "@testing-library/react";

import ExternalLink from "@/components/ExternalLink";

describe("ExternalLink", () => {
  it("renders a link", () => {
    render(
      <ExternalLink href="https://www.solana.com" text="Visit solana.com" />
    );

    const el = screen.getByRole("link");

    expect(el).toHaveTextContent("Visit solana.com");
    expect(el).toHaveAttribute("href", "https://www.solana.com");
    expect(el).toHaveAttribute("target", "_blank"); // open new browser tab
    expect(el).toHaveAttribute("rel", "noreferrer"); // important security fix for links opening in new tabs
    expect(el).toHaveClass("underline"); // tailwindcss
  });
});
