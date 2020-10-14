export class GraphQLError extends Error {
  [key: string]: any;

  constructor({ message, ...others }: Partial<GraphQLError>) {
      super(message || "error");
      this.name = this.constructor.name;
      Object.assign(this, others);
  }
}
