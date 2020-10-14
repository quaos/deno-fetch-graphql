import { assertEquals } from "./deps/std.ts";

import { GraphQLError } from "./errors.ts";
import { GraphQLResponse } from "./response.ts";
import type { Operation } from "./ops.ts";

Deno.test("test GQL response deserialization", () => {
  const helloOp = <Operation> {
    field: "hello",
  };

  const resp = new GraphQLResponse(JSON.parse(`{
    "data": {
      "hello": {
        "message": "Hello, Q!",
        "authorization": {
          "passed": true,
          "clearanceLevel": 9
        }
      }
    },
    "errors": [
      { "message": "Power overwhelming", "code": "PWN999" }
    ]
  }`));

  interface HelloResponseData {
    message: string;
    authorization: Record<string, any>;
  }

  const expectedData = <HelloResponseData> {
    message: "Hello, Q!",
    authorization: {
      "passed": true,
      "clearanceLevel": 9,
    },
  };

  const helloData: HelloResponseData = resp.getData(helloOp);

  assertEquals(helloData, expectedData);

  const expectedErrors: GraphQLError[] = [
    new GraphQLError({ message: "Power overwhelming", code: "PWN999" }),
  ];

  assertEquals(resp.errors, expectedErrors);
});
