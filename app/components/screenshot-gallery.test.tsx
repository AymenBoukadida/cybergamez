import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { subwaySurfers } from "@/app/data/games";
import { ScreenshotGallery } from "./ScreenshotGallery";

it("opens a screenshot, moves with arrows and closes with Escape", async () => {
  const user = userEvent.setup();
  render(<ScreenshotGallery shots={subwaySurfers.screenshots} />);
  await user.click(screen.getAllByRole("button", { name: /view screenshot 1/i })[0]);
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  await user.keyboard("{ArrowRight}");
  expect(screen.getByText("2 / 3")).toBeInTheDocument();
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /view screenshot 1/i })[0]).toHaveFocus();
});
