import { act, fireEvent, render, screen } from "@testing-library/react";
import { ToastProvider, useToast } from "./Toast";

function Trigger() {
  const { showToast } = useToast();
  return <button onClick={() => showToast("Download started")}>go</button>;
}

it("shows a status message and dismisses it after four seconds", () => {
  vi.useFakeTimers();
  render(
    <ToastProvider>
      <Trigger />
    </ToastProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "go" }));
  expect(screen.getByRole("status")).toHaveTextContent("Download started");
  act(() => vi.advanceTimersByTime(4000));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  vi.useRealTimers();
});
