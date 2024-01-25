import React from "react";
import useMe from "../../hooks/useMe";
import Button from "../../components/Button";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { graphql } from "../../__generated__";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import {
  EditProfileMutation,
  EditProfileMutationVariables,
} from "../../__generated__/graphql";
import { Helmet } from "react-helmet-async";

const EDIT_PROFILE_MUTATION = graphql(`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`);

interface IFormProps {
  email?: string;
  password?: string;
}

const EditProfile = () => {
  const { data: userData, refetch } = useMe();
  const client = useApolloClient();
  const onCompleted = (data: EditProfileMutation) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
    }
  };
  const [editProfile, { loading }] = useMutation<
    EditProfileMutation,
    EditProfileMutationVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });
  const {
    register,
    handleSubmit,
    formState: { isValid },
    getValues,
  } = useForm<IFormProps>({
    defaultValues: {
      email: userData?.me.email,
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const { email, password } = data;
    editProfile({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };
  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <Helmet>
        <title>Edit Profile | Uber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" max-w-screen-sm grid grid-gap mt-5 w-full mb-5"
      >
        <input
          {...register("email", {
            pattern:
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          name="email"
          className="input"
          type="email"
          placeholder="Email"
        />
        <input
          {...register("password")}
          name="password"
          className="input"
          type="password"
          placeholder="Password"
        />
        <Button
          loading={loading}
          cnaClick={isValid}
          actionText="Save Profile"
        />
      </form>
    </div>
  );
};

export default EditProfile;
