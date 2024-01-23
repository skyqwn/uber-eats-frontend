import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import uberLogo from "../images/ubereats.svg";

import FormError from "../components/FormError";
import { useMutation } from "@apollo/client";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { gql } from "../__generated__/";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../__generated__/graphql";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constant";

const LOGIN_MUTATION = gql(`
  mutation login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`);

interface ILoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    getValues,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ILoginForm>();
  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
    }
  };
  const [login, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      login({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };

  return (
    <div className="h-screen flex flex-col items-center mt-10 lg:mt-28">
      <Helmet>
        <title>Login | Uber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={uberLogo} className="w-52 mb-5 " />
        <h4 className="w-full font-medium text-left text-3xl mb-10">
          Welcome back
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

          <Button cnaClick={isValid} loading={loading} actionText="Log In" />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          New to Uber?{" "}
          <Link to={"/signup"} className="text-lime-600 hover:underline">
            {" "}
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
