import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useSubscription } from "@apollo/client";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryPie,
  VictoryTheme,
  VictoryVoronoiContainer,
} from "victory";

import { graphql } from "../../__generated__";
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
  PendingOrdersSubscription,
} from "../../__generated__/graphql";
import Dish from "../../components/Dish";

export const MY_RESTAURANT_QUERY = graphql(`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      error
      ok
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
`);

export const PENDING_ORDERS_SUBSCRIPTION = graphql(`
  subscription pendingOrders {
    pendingOrders {
      ...FullOrderParts
    }
  }
`);

const MyRestaurant = () => {
  const { id } = useParams() as { id: string };
  const navigate = useNavigate();
  const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    }
  );
  const { data: subscriptionData } = useSubscription<PendingOrdersSubscription>(
    PENDING_ORDERS_SUBSCRIPTION
  );

  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      navigate(`/orders/${subscriptionData.pendingOrders.id}`);
    }
  }, [subscriptionData]);
  return (
    <div>
      <div
        className="bg-gray-700 py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImage})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || "Loading..."}
        </h2>
        <Link
          to={`/restaurant/${id}/add-dish`}
          className="mr-8 text-white bg-gray-800 py-3 px-10"
        >
          Add Dish &rarr;
        </Link>
        <Link to={``} className="text-white bg-lime-700 py-3 px-10">
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className="text-xl mb-5">Please upload a dish!</h4>
          ) : (
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.myRestaurant.restaurant?.menu.map((dish) => (
                <Dish
                  key={dish.id}
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-20 mb-10">
          <h4 className="text-center text-lg font-medium">Sales</h4>
          <div className=" mx-auto">
            <VictoryChart
              height={500}
              theme={VictoryTheme.material}
              domainPadding={50}
              width={window.innerWidth}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryLine
                data={data?.myRestaurant.restaurant?.orders.map((order) => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation="linear"
                style={{
                  data: {
                    strokeWidth: 5,
                  },
                }}
              />
              <VictoryAxis
                style={{ tickLabels: { fontSize: 20, fill: "#4D7C0F" } as any }}
                dependentAxis
                tickFormat={(tick) => `$${tick}`}
              />
              <VictoryAxis
                style={{ tickLabels: { fontSize: 20 } as any }}
                tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
                label="Days"
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRestaurant;
