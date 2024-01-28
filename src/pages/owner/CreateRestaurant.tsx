import React, { useState } from "react";
import { graphql } from "../../__generated__";
import { useApolloClient, useMutation } from "@apollo/client";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from "../../__generated__/graphql";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../../components/Button";
import { Helmet } from "react-helmet-async";
import FormError from "../../components/FormError";
import { MY_RESTAURANTS_QUERY } from "./MyRestaurants";
import { useNavigate } from "react-router-dom";

const CREATE_RESTAURANT_MUTATION = graphql(`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`);

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

const CreateRestaurant = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurant: { ok, error, restaurantId },
    } = data;
    if (ok) {
      const { name, categoryName, address } = getValues();
      setUploading(false);
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      if (!queryResult) {
        alert("sorry u can't");
        navigate("/");
      }
      if (queryResult) {
        client.writeQuery({
          query: MY_RESTAURANTS_QUERY,
          data: {
            myRestaurants: {
              ...queryResult?.myRestaurants,
              restaurants: [
                {
                  address,
                  category: {
                    name: categoryName,
                    __typename: "Category",
                  },
                  coverImage: imageUrl,
                  id: restaurantId,
                  isPromoted: false,
                  name,
                  __typename: "Restaurant",
                },
                ...queryResult.myRestaurants.restaurants,
              ],
            },
          },
        });
        navigate("/");
      }
    }
  };
  const [createRestaurantMutation, { data }] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<IFormProps>();
  const [uploading, setUploading] = useState(false);
  const onSubmit: SubmitHandler<IFormProps> = async (data: IFormProps) => {
    try {
      setUploading(true);
      const { file, name, categoryName, address } = data;
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: coverImage } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
          // headers: { "Content-Type": "multipart/form-data" },
        })
      ).json();
      setImageUrl(coverImage);
      createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImage,
          },
        },
      });
    } catch (error) {
      console.log(11);
      console.log(error);
    }
  };
  return (
    <div className="container">
      <Helmet>
        <title>Add Restaurant | Uber Eats</title>
      </Helmet>
      <h1>Create Restaurant</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className="input"
          {...register("name", { required: "Name requried" })}
          name="name"
          type="text"
          placeholder="Name"
        />
        <input
          className="input"
          {...register("address", { required: "Address requried" })}
          name="address"
          type="text"
          placeholder="Address"
        />
        <input
          className="input"
          {...register("categoryName", { required: "Category Name requried" })}
          name="categoryName"
          type="text"
          placeholder="CategoryName"
        />
        <div>
          <input
            {...register("file", { required: true })}
            type="file"
            name="file"
            accept="image/*"
          />
        </div>
        <Button
          loading={uploading}
          cnaClick={isValid}
          actionText="Create Restaurant"
        />
        {data?.createRestaurant?.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};

export default CreateRestaurant;
