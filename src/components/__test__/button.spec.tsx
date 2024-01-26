import { render } from "@testing-library/react";
import Button from "../Button";

describe("<Button/>", () => {
  it("should render OK with props", () => {
    const { getByText } = render(
      <Button cnaClick={true} loading={false} actionText={"test"} />
    );
    getByText("test");
  });
  it("should display loading", () => {
    const { debug, getByText, container } = render(
      <Button cnaClick={false} loading={true} actionText={"test"} />
    );
    getByText("Loading...");
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });
});
