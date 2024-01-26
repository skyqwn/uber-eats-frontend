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

export const CATEGORY_FRAGMENT = graphql(`
  fragment CategoryParts on Category {
    id
    name
    coverImage
    slug
    restaurantCount
  }
`);
