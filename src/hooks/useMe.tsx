import React from "react";
import { graphql } from "../__generated__";
import { useQuery } from "@apollo/client";
import { MeQuery } from "../__generated__/graphql";

const ME_QUERY = graphql(`
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
