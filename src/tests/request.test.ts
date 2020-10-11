import { GraphQLRequest } from "../request.ts";
import { Operation, OperationType } from "../ops.ts";
import { StandardScalarType } from "../fields.ts";

// TODO: Make this a proper unit test

interface HelloInputVars {
  myName: string;
  myPosition: string;
  jobName: string;
}

const req = new GraphQLRequest<HelloInputVars>()
  .add(<Operation> {
    operationType: OperationType.Query,
    name: "Hello",
    variableDefs: [
      {
        name: "myName",
        graphqlType: "string!",
      },
      {
        name: "myPosition",
        graphqlType: "string!",
      },
    ],
    field: {
      name: "hello",
      args: [
        {
          name: "name",
          fromVariable: "myName",
        },
        {
          name: "position",
          fromVariable: "myPosition",
        },
        {
          name: "secretHandshake",
          value: "0123abc",
          valueType: "String!",
        },
        {
          name: "checkSum",
          value: 999,
          valueType: StandardScalarType.Int,
        },
      ],
      children: [
        "message",
        {
          name: "authorization",
          children: [
            "passed",
            "clearanceLevel",
          ],
        },
      ],
    }
  })
  .add(<Operation> {
    operationType: OperationType.Mutation,
    name: "SubmitJob",
    variableDefs: [
      {
        name: "jobName",
        graphqlType: "string!",
      },
      {
        name: "myName",
        graphqlType: "string!",
      },
    ],
    field: {
      name: "submitJob",
      args: [
        {
          name: "name",
          fromVariable: "jobName",
        },
        {
          name: "ownerName",
          fromVariable: "myName",
        },
      ],
    },
  })
  .withVariables(<HelloInputVars> {
    myName: "Q",
    myPosition: "CTO",
    jobName: "cleanEmUp",
  });

console.log(`Generated request: {
"query": ${JSON.stringify(req.serializeQuery())},
"variables": ${JSON.stringify(req.variables || {})},
}`);
