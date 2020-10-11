import type { GraphQLRequest } from "./request.ts";
import { GraphQLResponse } from "./response.ts";

export class GraphQLClient {
    url: URL | string = "http://localhost:8080/graphql";

    public constructor(props?: Partial<GraphQLClient>) {
        (props) && Object.assign(this, props);
    }

    public async send<TVariables>(request: GraphQLRequest<TVariables>): Promise<GraphQLResponse> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (request.authToken) {
            headers["Authorization"] = `Bearer ${request.authToken}`;
        }
        const resp = await fetch(this.url, {
            method: "POST",
            headers,
            body: JSON.stringify({
                query: request.serializeQuery(),
                variables: request.variables || {},
            }),
        });

        return new GraphQLResponse(await resp.json())
    }
}
