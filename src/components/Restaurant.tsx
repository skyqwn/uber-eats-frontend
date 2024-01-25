import React from "react";

interface IRestaurantProps {
  id: string;
  coverImage: string;
  name: string;
  categoryName?: string;
}

const Restaurants: React.FC<IRestaurantProps> = ({
  coverImage,
  name,
  categoryName,
}) => {
  return (
    <div className="flex flex-col">
      <div
        style={{ backgroundImage: `url(${coverImage})` }}
        className=" py-28 bg-cover bg-center mb-3"
      ></div>
      <h3 className="text-xl font-medium">{name}</h3>
      <span className="border-t mt-2 py-2 text-xs border-gray-400">
        {categoryName}
      </span>
    </div>
  );
};

export default Restaurants;
