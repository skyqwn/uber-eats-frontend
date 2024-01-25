import React, { useEffect } from "react";
import { graphql } from "../../__generated__";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from "../../__generated__/graphql";
import { useLocation, useNavigate } from "react-router-dom";
import useMe from "../../hooks/useMe";
import { Helmet } from "react-helmet-async";

const VERIFY_EMAIL_MUTATION = graphql(`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`);

const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const navagate = useNavigate();
  const onCompleted = (data: VerifyEmailMutation) => {
    {
      const {
        verifyEmail: { ok },
      } = data;
      if (ok && userData?.me.id) {
        client.writeFragment({
          id: `User:${userData?.me.id}`,
          fragment: gql`
            fragment VerifiedUser on User {
              verified
            }
          `,
          data: {
            verified: true,
          },
        });
        navagate("/");
      }
    }
  };
  const [verifyEmail] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTATION, {
    onCompleted,
  });

  useEffect(() => {
    const [_, code] = window.location.href.split("code=");
    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
  }, []);
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>Verify Email | Uber Eats</title>
      </Helmet>
      <h2 className="text-lg mb-2 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait, don't close this page
      </h4>
    </div>
  );
};

export default ConfirmEmail;
