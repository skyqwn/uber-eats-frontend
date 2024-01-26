import { render } from "@testing-library/react";
import Restaurants from "../Restaurant";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Restaurant/>", () => {
  it("renders OK with props", () => {
    const restaurantProps = {
      id: "1",
      coverImage: "x",
      name: "nameTest",
      categoryName: "catTest",
    };
    const { getByText, container } = render(
      <Router>
        <Restaurants {...restaurantProps} />
      </Router>
    );
    getByText(restaurantProps.name);
    getByText(restaurantProps.categoryName);
    expect(container.firstChild).toHaveAttribute(
      "href",
      `/restaurant/${restaurantProps.id}`
    );
  });
});
