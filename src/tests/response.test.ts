import { GraphQLResponse } from "../response.ts";
import type { Operation } from "../ops.ts";

// TODO: Make this a proper unit test

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

const helloData: HelloResponseData = resp.getData(helloOp);

console.log(`Extracted response data for query [hello]: ${Deno.inspect(helloData, { depth: 99 })}`);

console.log(`Extracted response errors: ${Deno.inspect(resp.getErrors(), { depth: 99 })}`);
