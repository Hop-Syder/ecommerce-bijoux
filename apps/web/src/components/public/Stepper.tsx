const STEPS = ["Informations", "Livraison", "Confirmation"];

export function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex items-center justify-center gap-4 text-sm">
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isDone = stepNumber < currentStep;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                isActive || isDone ? "bg-noir text-ivoire" : "border border-noir/20 text-anthracite/50"
              }`}
            >
              {stepNumber}
            </span>
            <span className={isActive ? "font-medium text-noir" : "text-anthracite/50"}>
              {label}
            </span>
            {stepNumber < STEPS.length && <span className="mx-2 text-anthracite/30">—</span>}
          </li>
        );
      })}
    </ol>
  );
}
