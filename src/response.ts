import type { Operation } from "./ops.ts";
import { GraphQLError } from "./errors.ts";
import { isComplexField } from "./fields.ts";

export class GraphQLResponse {
  data?: any;
  errors: GraphQLError[];

  constructor({ errors, ...others }: Partial<GraphQLResponse>) {
    this.errors = (errors) ? errors.map(e => new GraphQLError(e)) : <GraphQLError[]>[];
    Object.assign(this, others);
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

  hasError(): boolean {
    return this.errors.length >= 1
  }

  throwFirstError(): void {
    if (this.errors.length >= 1) {
      throw this.errors[0]
    }
  }
}
