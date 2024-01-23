import React, { useEffect } from "react";
import { gql } from "../../__generated__";
import { useMutation } from "@apollo/client";
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from "../../__generated__/graphql";
import { useLocation } from "react-router-dom";

const VERIFY_EMAIL_MUTATION = gql(`
    mutation verifyEmail($input:VerifyEmailInput!){
        verifyEmail(input:$input){
            ok
            error
        }
    }
`);

const ConfirmEmail = () => {
  const [verifyEmail, { loading }] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTATION);
  const location = useLocation();
  const param = new URLSearchParams(useLocation().search);

  console.log(param);
  useEffect(() => {
    // const [_, code] = window.location.href.split("code=");
    // const newLocal = verifyEmail({
    //   variables: {
    //     input: {
    //       code,
    //     },
    //   },
    // });
  }, []);
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <h2 className="text-lg mb-2 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait, don't close this page
      </h4>
    </div>
  );
};

export default ConfirmEmail;
