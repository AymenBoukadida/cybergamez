import { render, screen } from "@testing-library/react";
import { Trailer } from "./Trailer";

it("attaches English captions and exposes the transcript without playing", () => {
  const { container } = render(<Trailer />);
  const track = container.querySelector("track") as HTMLTrackElement;
  expect(track.kind).toBe("captions");
  expect(track.srclang).toBe("en");
  expect(track.default).toBe(true);
  expect(screen.getByText("Read transcript")).toBeInTheDocument();
});
