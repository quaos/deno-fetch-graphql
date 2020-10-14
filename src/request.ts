import type { Operation, VariableDef } from "./ops.ts";
import {
  ComplexField,
  Field,
  FieldArg,
  isComplexField,
  StandardScalarType,
  stripFieldArgType,
} from "./fields.ts";

export class GraphQLRequest<TVariables> {
  operations: Operation[];
  variables?: TVariables;
  authToken?: string;

  public constructor(props?: Partial<GraphQLRequest<TVariables>>) {
    this.operations = [];
    (props) && Object.assign(this, props);
  }

  public add(operation: Operation): GraphQLRequest<TVariables> {
    this.operations.push(operation);
    return this
  }

  public withVariables(variables: TVariables): GraphQLRequest<TVariables> {
    this.variables = variables;
    return this
  }

  public withAuthToken(authToken: string): GraphQLRequest<TVariables> {
    this.authToken = authToken;
    return this
  }

  serializeQuery(): string {
    function serializeOp(op: Operation): string {
      const headerParts: string[] = [op.operationType, " "];
      (op.name) && headerParts.push(op.name);
      if ((op.variableDefs) && (op.variableDefs.length > 0)) {
        const varDefParts: string[] = op.variableDefs.map(serializeVariableDef)
        headerParts.push(`(${varDefParts.join(", ")})`);
      }

      return `${headerParts.join("")} {\n`
      + `${serializeField(op.field, 1)}\n`
      + "}"
    }

    function serializeVariableDef(varDef: VariableDef): string {
      return `$${varDef.name}: ${varDef.graphqlType}`;
    }

    function serializeField(field: Field, level: number): string {
      const indentStr = indent(level);
      const argsStr = ((isComplexField(field)) && (field.args) && (field.args.length > 0))
        ? "(\n"
        + `${field.args.map(arg => serializeFieldArg(arg, level + 1)).join(",\n")}\n`
        + `${indentStr})`
        : "";
      const childrenStr = ((isComplexField(field)) && (field.children) && (field.children.length > 0))
        ? " {\n"
        + `${field.children.map(child => serializeField(child, level + 1)).join(",\n")}\n`
        + `${indentStr}}`
        : "";
        
      return `${indentStr}${(isComplexField(field)) ? field.name : field}${argsStr}${childrenStr}`;
    }

    function serializeFieldArg(arg: FieldArg, level: number): string {
      const indentStr = indent(level);
      const quoteStr = ((arg.valueType)
        && (stripFieldArgType(arg.valueType) === StandardScalarType.String))
        ? "\""
        : "";
      const valueStr = (arg.fromVariable)
        ? `$${arg.fromVariable}`
        : `${quoteStr}${arg.value || ""}${quoteStr}`;
      
      return `${indentStr}${arg.name}: ${valueStr}`;
    }

    function indent(level: number): string {
      return " ".repeat(2 * level)
    }

    const parts = this.operations.map(serializeOp);

    return parts.join("\n\n")
  }
}
