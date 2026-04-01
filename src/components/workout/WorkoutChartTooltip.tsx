const WorkoutChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-1.5 shadow-sm text-xs">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold">
        {payload[0].value}
        {typeof payload[0].value === "number" && payload[0].dataKey === "weight" ? " kg" : ""}
        {typeof payload[0].value === "number" && payload[0].dataKey === "minutes" ? " min" : ""}
        {typeof payload[0].value === "number" && payload[0].dataKey === "distance" ? " km" : ""}
        {typeof payload[0].value === "number" && payload[0].dataKey === "pace" ? " min/km" : ""}
      </p>
    </div>
  );
};

export default WorkoutChartTooltip;
