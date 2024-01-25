import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { graphql } from "../../__generated__";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import { useLazyQuery } from "@apollo/client";
import {
  SearchRestaurantQuery,
  SearchRestaurantQueryVariables,
} from "../../__generated__/graphql";

const SEARCH_RESTAURANT = graphql(`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
`);

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [queryReadyToStart, { loading, data, called }] = useLazyQuery<
    SearchRestaurantQuery,
    SearchRestaurantQueryVariables
  >(SEARCH_RESTAURANT);
  useEffect(() => {
    const [_, query] = location.search.split("?term=");
    if (!query) {
      return navigate("/", { replace: true });
    }
    queryReadyToStart({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    });
  }, []);
  console.log(loading, data, called);
  return (
    <div>
      <Helmet>
        <title>Home | Uber Eats</title>
      </Helmet>
    </div>
  );
};

export default Search;
