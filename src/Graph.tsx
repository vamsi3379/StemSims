import React from "react";

type GraphProps = {
  exampleData: any[]
}

export function Graph({exampleData}: GraphProps) {
  return (
    <ul>
      <button>Line Graph</button>
      <button>Bar Graph</button>
      <button>Pie Chart</button>
    </ul>
  );
};
