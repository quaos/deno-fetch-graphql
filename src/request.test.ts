import { assertEquals } from "./deps/std.ts";

import { GraphQLRequest } from "./request.ts";
import { Operation, OperationType } from "./ops.ts";
import { StandardScalarType } from "./fields.ts";

Deno.test("test GQL request serialization", () => {
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
          graphqlType: "String!",
        },
        {
          name: "myPosition",
          graphqlType: "String!",
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
          graphqlType: "String!",
        },
        {
          name: "myName",
          graphqlType: "String!",
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

  const expectedQuery = "query Hello($myName: String!, $myPosition: String!) {"
    + "\n  hello("
    + "\n    name: $myName,"
    + "\n    position: $myPosition,"
    + "\n    secretHandshake: \"0123abc\","
    + "\n    checkSum: 999"
    + "\n  ) {"
    + "\n    message,"
    + "\n    authorization {"
    + "\n      passed,"
    + "\n      clearanceLevel"
    + "\n    }"
    + "\n  }"
    + "\n}\n"
    + "\nmutation SubmitJob($jobName: String!, $myName: String!) {"
    + "\n  submitJob("
    + "\n    name: $jobName,"
    + "\n    ownerName: $myName" 
    + "\n  )"
    + "\n}";

  assertEquals(req.serializeQuery(), expectedQuery);
});
