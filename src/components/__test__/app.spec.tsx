import React from "react";
import { render, waitFor } from "@testing-library/react";
import App from "../App";
import { isLoggedInVar } from "../../apollo";

jest.mock("../../routers/logged-out-router.tsx", () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>,
  };
});
jest.mock("../../routers/logged-in-router.tsx", () => {
  return {
    LoggedInRouter: () => <span>logged-in</span>,
  };
});

describe("<App/>", () => {
  it("renders LoggedOutRouter", () => {
    const { getByText } = render(<App />);
    getByText("logged-out");
  });
  it("renders LoggedInRouter", async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      isLoggedInVar(true);
    });
    getByText("logged-in");
  });
});
