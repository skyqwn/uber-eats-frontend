import { render } from "@testing-library/react";
import FormError from "../FormError";

describe("<FormError/>", () => {
  it("renders OK with props", () => {
    const { getByText } = render(<FormError errorMessage="test" />);
    getByText("test");
  });
});
