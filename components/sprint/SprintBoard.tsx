// components/sprint/SprintBoard.tsx
"use client";

const mockTasks = [
  {
    id: 1,
    title: "Créer un éditeur de wireframes",
    status: "En cours",
    storyPoints: 8,
  },
  {
    id: 2,
    title: "Connexion Firebase Sprint",
    status: "À faire",
    storyPoints: 5,
  },
  { id: 3, title: "UI du Sprint Board", status: "À faire", storyPoints: 3 },
  {
    id: 4,
    title: "Test utilisateurs Sprint 23",
    status: "Terminé",
    storyPoints: 8,
  },
];

const columns = ["À faire", "En cours", "A tester", "Terminé"];

export function SprintBoard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((col) => (
        <div key={col} className="bg-muted p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">{col}</h3>
          <div className="space-y-2">
            {mockTasks
              .filter((task) => task.status === col)
              .map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg bg-background border"
                >
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Story Points : {task.storyPoints}
                  </p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
