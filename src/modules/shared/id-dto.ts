/**
 * Represent the output of most creational commands.
 * In order to respect CQRS faithfully, we limit the output of
 * our commands to a single ID.
 */
export type IDDto = {
  id: string;
};
