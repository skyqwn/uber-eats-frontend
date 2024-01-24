import React from "react";
import { Helmet } from "react-helmet-async";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import FormError from "../components/FormError";
import { useMutation } from "@apollo/client";
import uberLogo from "../images/ubereats.svg";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { graphql } from "../__generated__/gql";
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
  UserRole,
} from "../__generated__/graphql";

const CREATE_ACCOUNT_MUTATION = graphql(`
  mutation createAccount($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`);

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

const Signup = () => {
  const {
    register,
    getValues,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ICreateAccountForm>({
    defaultValues: {
      role: UserRole.Client,
    },
  });
  const navigate = useNavigate();
  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (ok) {
      alert("Account Created! Log in now!");
      navigate("/");
    }
  };
  const [createAccount, { loading, data: CreateAccountMutationResult }] =
    useMutation<CreateAccountMutation, CreateAccountMutationVariables>(
      CREATE_ACCOUNT_MUTATION,
      {
        onCompleted,
      }
    );
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const { email, password, role } = data;
    if (!loading) {
      createAccount({
        variables: {
          createAccountInput: {
            email,
            password,
            role,
          },
        },
      });
    }
  };
  return (
    <div className="h-screen flex flex-col items-center mt-10 lg:mt-28">
      <Helmet>
        <title>Signup | Uber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={uberLogo} className="w-52 mb-5 " />
        <h4 className="w-full font-medium text-left text-3xl mb-10">
          Let's get started
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-3"
        >
          <input
            {...register("email", {
              required: "Email is required",
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            required
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.email?.type === "pattern" && (
            <FormError errorMessage={"Please enter a valid email"} />
          )}
          <input
            {...register("password", {
              required: "Password is required",
            })}
            name="password"
            required
            type="password"
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage={"Password must be more than 10 chars."} />
          )}
          <select {...register("role", { required: true })} className="input">
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button cnaClick={isValid} loading={loading} actionText="Sign Up" />
          {CreateAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={CreateAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div>
          Already have an account{" "}
          <Link to={"/"} className="text-lime-600 hover:underline">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
