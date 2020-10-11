import type { Field } from "./fields.ts";

export enum OperationType {
    Query = "query",
    Mutation = "mutation",
    Subscription = "subscription",
}

export interface VariableDef {
    name: string;
    graphqlType: string;
}

export interface Operation {
    operationType: OperationType;
    name?: string;
    variableDefs?: VariableDef[];
    field: Field;
}
