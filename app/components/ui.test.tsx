import { render, screen } from "@testing-library/react";
import { Button, buttonClasses } from "./Button";
import { Rating } from "./Rating";
import { SectionHeading } from "./SectionHeading";

it("primary button uses the brand token and defaults to type=button", () => {
  render(<Button>Download</Button>);
  const button = screen.getByRole("button", { name: "Download" });
  expect(button).toHaveAttribute("type", "button");
  expect(button.className).toContain("bg-brand");
});

it("button classes expose a secondary variant", () => {
  expect(buttonClasses({ variant: "secondary" })).toContain("border-line");
});

it("rating exposes a readable label and the score", () => {
  render(<Rating value={4.8} />);
  expect(screen.getByLabelText("Rated 4.8 out of 5")).toHaveTextContent("4.8");
});

it("section heading renders an h2 with an optional id", () => {
  render(<SectionHeading id="new" title="New releases" subtitle="Fresh drops" />);
  expect(screen.getByRole("heading", { level: 2, name: "New releases" })).toHaveAttribute("id", "new");
});
