import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { graphql } from "../../__generated__";
import { useMutation } from "@apollo/client";
import {
  CreateDishMutation,
  CreateDishMutationVariables,
} from "../../__generated__/graphql";
import { Helmet } from "react-helmet-async";
import {
  FieldValues,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import Button from "../../components/Button";
import { MY_RESTAURANT_QUERY } from "./MyRestaurant";

interface IForm {
  name: string;
  price: string;
  description: string;
  options: {
    optionName: string;
    optionExtra: string;
  }[];
}

const CREATE_DISH_MUTATION = graphql(`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`);

const CreateDish = () => {
  const { id: restaurantId } = useParams() as { id: string };
  const navigate = useNavigate();
  const [createDishMutation, { data, loading }] = useMutation<
    CreateDishMutation,
    CreateDishMutationVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId,
          },
        },
      },
    ],
  });
  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    control,
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      description: "",
      options: [{ name: "", extra: 0 }],
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const { name, price, description, options } = data;
    console.log(options);
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
          options,
        },
      },
    });
    navigate(-1);
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          {...register("name", { required: "Name is required" })}
          className="input"
          type="text"
          name="name"
          placeholder="Name"
        />
        <input
          {...register("price", { required: "Price is required" })}
          className="input"
          type="number"
          name="price"
          min={0}
          placeholder="Price"
        />
        <input
          {...register("description", {
            required: "Description is required",
          })}
          className="input"
          type="text"
          name="description"
          placeholder="Description"
        />
        <div className="my-10">
          <h4 className="font-medium  mb-3 text-lg">Dish Options</h4>
          <span
            onClick={() => append({ name: "", extra: 0 })}
            className=" cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 mb-10"
          >
            Add Dish Option
          </span>
          {fields.map((field, index) => (
            <div key={field.id}>
              <input
                {...register(`options.${index}.name`)}
                className="input"
                placeholder="optionName"
                type="text"
              />
              <input
                {...register(`options.${index}.extra`, {
                  valueAsNumber: true,
                })}
                className="input"
                placeholder="optionExtra"
                type="number"
                min={0}
              />
              <button
                className=" cursor-pointer text-white mt-5   bg-red-500 ml-3 py-4 px-4"
                type="button"
                onClick={() => remove(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <Button loading={loading} cnaClick={isValid} actionText="Create Dish" />
      </form>
    </div>
  );
};
export default CreateDish;
