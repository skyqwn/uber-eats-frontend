import React, { useState } from "react";
import { graphql } from "../../__generated__";
import { useQuery } from "@apollo/client";
import Restaurants from "../../components/Restaurant";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  RestaurantPageQuery,
  RestaurantPageQueryVariables,
} from "../../__generated__/graphql";

const RESTAURANTS_QUERY = graphql(`
  query restaurantPage($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
`);

const Restaurant = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
    RestaurantPageQuery,
    RestaurantPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  const { register, handleSubmit } = useForm<FieldValues>();
  const navigate = useNavigate();
  const onSearchSubmit: SubmitHandler<FieldValues> = (data) => {
    const { searchTerm } = data;
    navigate({ pathname: "/search", search: `?term=${searchTerm}` });
  };

  return (
    <div>
      <Helmet>
        <title>Home | Uber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-40 flex items-center justify-center"
      >
        <input
          {...register("searchTerm", { required: true, min: 3 })}
          name="searchTerm"
          type="Search"
          className="input rounded-md border-0 w-3/4 md:w-3/12 "
          placeholder="Search Restaurants..."
        />
      </form>
      <div>
        {!loading && (
          <div className="max-w-screen-2xl mx-auto mt-8">
            <div className="flex justify-around max-w-sm mx-auto gap-8">
              {data?.allCategories.categories?.map((category) => (
                <Link key={category.id} to={`/category/${category.slug}`}>
                  <div className="flex flex-col group items-center cursor-pointer">
                    <div
                      className="w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
                      style={{ backgroundImage: `url(${category.coverImage})` }}
                    ></div>
                    <span className="mt-1 text-sm text-center font-bold">
                      {" "}
                      {category.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-16 grid md:grid-cols-3 gap-x-5 gap-y-10 ">
              {data?.restaurants.results?.map((restaurant) => (
                <Restaurants
                  key={restaurant.id}
                  id={restaurant.id + ""}
                  coverImage={restaurant.coverImage}
                  name={restaurant.name}
                  categoryName={restaurant.category?.name}
                />
              ))}
            </div>
            <div className="grid gird-cols-3 text-center max-w-md items-center mt-10 mx-auto">
              {page > 1 ? (
                <button
                  onClick={onPrevPageClick}
                  className="focus:outline-none font-medium text-2xl"
                >
                  &larr;
                </button>
              ) : (
                <div></div>
              )}
              <span className="mx-5">
                Page {page} of {data?.restaurants.totalPages}
              </span>
              {page !== data?.restaurants.totalPages ? (
                <button
                  onClick={onNextPageClick}
                  className="focus:outline-none font-medium text-2xl"
                >
                  &rarr;
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurant;
