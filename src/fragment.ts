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

export const DISH_FRAGMENT = graphql(`
  fragment DishParts on Dish {
    id
    name
    price
    photo
    description
    options {
      name
      extra
      choices {
        name
        extra
      }
    }
  }
`);

export const ORDERS_FRAGMENT = graphql(`
  fragment OrderParts on Order {
    id
    createdAt
    total
  }
`);

export const FULL_ORDER_FRAGMENT = graphql(`
  fragment FullOrderParts on Order {
    id
    status
    total
    driver {
      email
    }
    customer {
      email
    }
    restaurant {
      name
    }
  }
`);
