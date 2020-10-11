import type { Operation } from "./ops.ts";
import type { GraphQLError } from "./errors.ts";
import { isComplexField } from "./fields.ts";

export class GraphQLResponse {
  data?: any;
  errors?: GraphQLError[];

  constructor(props?: Partial<GraphQLResponse>) {
    (props) && Object.assign(this, props);
  }

  getData<TData>(operation: Operation) {
    if (!this.data) {
      throw new Error("No data found in response");
    }

    const key = (isComplexField(operation.field)) ? operation.field.name : operation.field;
    
    if (!(key in this.data)) {
      throw new Error(`data.${key} not found in response`);
    }

    return this.data[key] as TData
  }

  getErrors(): GraphQLError[] {
    return this.errors || []
  }
}
