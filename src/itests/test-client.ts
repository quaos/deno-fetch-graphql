import { GraphQLClient } from "../client.ts";
import { GraphQLRequest } from "../request.ts";
import { Operation, OperationType } from "../ops.ts";

interface HelloVars {
    myName: string;
}

interface HelloResultData {
    message: string;
    dateTime: string;
}

const helloOp = <Operation> {
    operationType: OperationType.Query,
    name: "Hello",
    variableDefs: [
        {
            name: "myName",
            graphqlType: "String!",
        },
    ],
    field: {
        name: "hello",
        args: [
            {
                name: "myNameIs",
                fromVariable: "myName",
            },
        ],
        children: [
            "message",
            "dateTime",
        ],
    }
};

const req = new GraphQLRequest<HelloVars>()
    .add(helloOp)
    .withVariables(<HelloVars> {
      myName: Deno.args[0] || "anonymous",
    });
console.log("Request:", req);

const client = new GraphQLClient({ url: "http://localhost:8080/graphql" });
const resp = await client.send(req);

if (resp.hasError()) {
    console.error("Got errors in response:", resp.errors);
    resp.throwFirstError();
}

const resultData: HelloResultData = resp.getData(helloOp);
console.log("Got result data:", resultData);
