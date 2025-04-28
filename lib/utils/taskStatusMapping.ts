export const taskStatusMapping = {
  todo: "À faire",
  "in-progress": "En cours",
  "in-testing": "À tester",
  done: "Terminé",
} as const;

export type KanbanStatus = keyof typeof taskStatusMapping;
export type DisplayStatus = (typeof taskStatusMapping)[KanbanStatus];
