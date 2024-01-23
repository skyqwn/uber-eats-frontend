import React from "react";
import { gql } from "../__generated__";
import { useQuery } from "@apollo/client";
import { MeQuery } from "../__generated__/graphql";

const ME_QUERY = gql(`
  query me {
    me {
      id
      email
      role
      verified
    }
  }
`);

const useMe = () => {
  return useQuery<MeQuery>(ME_QUERY);
};

export default useMe;
