import React from "react";
import { graphql } from "../../__generated__";
import { useMutation } from "@apollo/client";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from "../../__generated__/graphql";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../../components/Button";
import { Helmet } from "react-helmet-async";

const CREATE_RESTAURANT_MUTATION = graphql(`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
    }
  }
`);

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
}

const CreateRestaurant = () => {
  const [createRestaurantMutation, { loading, data }] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION, {
    variables: {
      input: {
        name: "",
        coverImage: "",
        address: "",
        categoryName: "",
      },
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FieldValues>();
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
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
        <Button
          loading={loading}
          cnaClick={isValid}
          actionText="Create Restaurant"
        />
      </form>
    </div>
  );
};

export default CreateRestaurant;
