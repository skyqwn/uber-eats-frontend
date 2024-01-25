import { graphql } from "./__generated__";

export const RESTAURANT_FRAGMENT = graphql(`
  fragment RestaurantParts on Restaurant {
    id
    name
    coverImage
    category {
      name
    }
    address
    isPromoted
  }
`);
