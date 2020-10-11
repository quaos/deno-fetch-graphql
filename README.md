# Deno Fetch GraphQL

A lightweight client for creating and sending GraphQL requests over Fetch API (without Schema/GQL Types validation)

## Examples

```typescript
import {
  GraphQLClient,
  GraphQLRequest,
  OperationType,
} from "https://deno.land/x/fetch-graphql";

interface HelloInputVars {
  myName: string;
}

const helloQuery = {
    operationType: OperationType.Query,
    name: "Hello",
    variableDefs: [
      {
        name: "myName",
        graphqlType: "string!",
      },
    ],
    field: {
      name: "hello",
      args: [
        {
          name: "from",
          fromVariable: "myName",
        }
      ],
      children: [
        "message",
        "andMyNameIs",
        {
          name: "yourInfo",
          children: [
            "ipAddress",
            "lastLoginAt",
          ]
        }
      ],
  }
};

const countUpMutation = {
  operationType: OperationType.Mutation,
  field: {
    name: "countUp",
    args: [
      {
        name: "increment",
        value: 10,
        valueType: "Int!",
      }
    ],
  }
};

const client = new GraphQLClient({ url: "http://myserver:8080/graphql" });
const gqlRequest = new GraphQLRequest<HelloInputVars>()
  .add(helloQuery)
  .add(countUpMutation)
  .withAuthToken("jwt01234abcd")
  .withVariables({
    myName: "Q",
  });

const gqlResponse = await client.send({
  operationType: OperationType.Query
});

interface HelloResult {
  message: string;
  andMyNameIs: string;
}

const errors = gqlResponse.getErrors();
errors.forEach(console.error);

const result = gqlResponse.getData<HelloResult>(helloQuery);
console.log(result);

```
