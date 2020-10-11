export enum StandardScalarType {
  String = "String",
  Int = "Int",
  Float = "Float",
  Boolean = "Boolean",
}

export type Field = string | ComplexField;

export interface ComplexField {
  name: string;
  args?: FieldArg[];
  children?: Field[];
}

export function isComplexField(field: Field): field is ComplexField {
  return (field as ComplexField).name !== undefined;
}

export interface FieldArg {
  name: string;
  fromVariable?: string;
  value?: string;
  valueType?: string;
}

export function stripFieldArgType(argType: string) {
  return argType.replace(/^(.+?)!$/, "$1")
}