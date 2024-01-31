import React, { useEffect, useState } from "react";
import GoogleMapReact, { Position } from "google-map-react";
import { graphql } from "../../__generated__";
import { useMutation, useSubscription } from "@apollo/client";
import {
  CookedOrdersSubscription,
  TakeOrderMutation,
  TakeOrderMutationVariables,
} from "../../__generated__/graphql";
import { Link, useNavigate } from "react-router-dom";

const COOKED_ORDERS_SUBSCRIPTION = graphql(`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
`);
const TAKE_ORDER_MUTATAION = graphql(`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`);

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}
const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚖</div>;

const DashBoard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();
  const onSucces = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  // @ts-ignore
  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSucces, onError, {
      enableHighAccuracy: true,
    });
  }, []);
  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      //   const geocoder = new google.maps.Geocoder();
      //   geocoder.geocode(
      //     {
      //       location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
      //     },
      //     (results, status) => {
      //       console.log(status, results);
      //     }
      //   );
    }
  }, [driverCoords.lat, driverCoords.lng]);
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };

  const { data: cookedOrdersData } = useSubscription<CookedOrdersSubscription>(
    COOKED_ORDERS_SUBSCRIPTION
  );
  const navigate = useNavigate();
  const onCompleted = (data: TakeOrderMutation) => {
    if (data.takeOrder.ok) {
      navigate(`/orders/${cookedOrdersData?.cookedOrders.id}`);
    }
  };

  const [takeOrdeMutation, { data, loading }] = useMutation<
    TakeOrderMutation,
    TakeOrderMutationVariables
  >(TAKE_ORDER_MUTATAION, { onCompleted });
  const triggerMutation = (orderId: number) => {
    takeOrdeMutation({
      variables: {
        input: {
          id: orderId,
        },
      },
    });
  };
  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id) {
    }
  }, [cookedOrdersData]);
  return (
    <div>
      <div
        className="  overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={16}
          defaultCenter={{
            lat: 37.6,
            lng: 126.65,
          }}
          bootstrapURLKeys={{ key: "AIzaSyCUAuq3jhHeDzQQ6Rti4PccUhDRsGjsJ4I" }}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
      <div className=" max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrdersData?.cookedOrders.restaurant ? (
          <>
            <h1 className="text-center  text-3xl font-medium">
              New Coocked Order
            </h1>
            <h1 className="text-center my-3 text-2xl font-medium">
              Pick it up soon @{" "}
              {cookedOrdersData?.cookedOrders.restaurant?.name}
            </h1>
            <button
              onClick={() => triggerMutation(cookedOrdersData.cookedOrders.id)}
              className="btn w-full  block  text-center mt-5"
            >
              Accept Challenge &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center  text-3xl font-medium">
            No orders yet...
          </h1>
        )}
      </div>
    </div>
  );
};
export default DashBoard;

//AIzaSyCUAuq3jhHeDzQQ6Rti4PccUhDRsGjsJ4I
