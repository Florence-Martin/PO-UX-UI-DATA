// components/sprint/SprintVelocity.tsx
"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

export function SprintVelocity() {
  const data = {
    labels: ["J1", "J2", "J3", "J4", "J5", "J6", "J7"],
    datasets: [
      {
        label: "Burndown prévu",
        data: [34, 29, 24, 19, 14, 9, 0],
        borderColor: "#60a5fa",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Burndown réel",
        data: [34, 28, 25, 22, 20, 17, 14],
        borderColor: "#f87171",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Story Points Restants",
        },
      },
      x: {
        title: {
          display: true,
          text: "Jour du Sprint",
        },
      },
    },
  };

  return (
    <div className="bg-background rounded-xl p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Burndown Chart</h2>
      <Line data={data} options={options} />
    </div>
  );
}
