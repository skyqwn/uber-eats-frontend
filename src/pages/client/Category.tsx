import { useParams } from "react-router-dom";
import { graphql } from "../../__generated__";
import { useQuery } from "@apollo/client";
import {
  CategoryQuery,
  CategoryQueryVariables,
} from "../../__generated__/graphql";

const CATEGORY_QUERY = graphql(`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
`);

interface ICategoryParams {
  slug: string;
}

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading } = useQuery<CategoryQuery, CategoryQueryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page: 1,
          slug: slug + "",
        },
      },
    }
  );
  return <div>category</div>;
};

export default Category;
