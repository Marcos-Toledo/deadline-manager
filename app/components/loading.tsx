export const Loading = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex min-h-screen items-center justify-center">
      <svg
        className="w-12 h-12 text-primary"
        viewBox="0 0 24 24"
        xmlns="http://w3.org"
      >
        {/* Clock Outline */}
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {/* Fast Hand */}
          <line
            x1="12"
            y1="12"
            x2="12"
            y2="6"
            className="origin-[12px_12px] animate-spin"
          />
          {/* Slow Hand */}
          <line
            x1="12"
            y1="12"
            x2="16"
            y2="12"
            className="origin-[12px_12px] animate-[spin_12s_linear_infinite]"
          />
        </g>
      </svg>
    </div>
  );
};
