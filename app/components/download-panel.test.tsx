import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DownloadPanel } from "./DownloadPanel";
import { ToastProvider } from "./Toast";

it("downloads the APK only from the Android control and shows a toast", async () => {
  const user = userEvent.setup();
  render(
    <ToastProvider>
      <DownloadPanel />
    </ToastProvider>,
  );
  const android = screen.getByRole("link", { name: /android/i });
  expect(android).toHaveAttribute("href", "/download-files/subway-surfers-demo.apk");
  expect(android).toHaveAttribute("download");
  await user.click(android);
  expect(screen.getByRole("status")).toHaveTextContent(/download/i);
});

it("marks iOS and Windows as unavailable and never links them to the APK", () => {
  render(
    <ToastProvider>
      <DownloadPanel />
    </ToastProvider>,
  );
  for (const name of [/ios/i, /windows/i]) {
    const control = screen.getByRole("button", { name });
    expect(control).toBeDisabled();
    expect(control).not.toHaveAttribute("href");
  }
});
