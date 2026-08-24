// Small, dependency-free inline SVG icon set (24x24 viewBox, currentColor stroke).
const base = {
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const MicIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10a7 7 0 0 0 14 0" />
    <path d="M12 19v3" />
    <path d="M8 22h8" />
  </svg>
);

export const StopIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);

export const CartIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="9" cy="21" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="18" cy="21" r="1.4" fill="currentColor" stroke="none" />
    <path d="M2.5 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6" />
  </svg>
);

export const SearchIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

export const CloseIcon = (props) => (
  <svg {...base} {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const PlusIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M5 12h14" />
  </svg>
);

export const TrashIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
  </svg>
);

export const CheckCircleIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.5 2.5 4.5-5" />
  </svg>
);

export const AlertCircleIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5" />
    <circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const InfoCircleIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <circle cx="12" cy="8" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const SparkleIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
  </svg>
);

export const LeafIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M5 12c0-5 4-9 14-9-0 10-4 14-9 14a5 5 0 0 1-5-5Z" />
    <path d="M5 19c4-4 6-7 14-14" />
  </svg>
);

export const ClockIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

export const SpeakerIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M4 9v6h4l5 4V5L8 9H4Z" />
    <path d="M16.5 8.5a5 5 0 0 1 0 7" />
    <path d="M19 6a9 9 0 0 1 0 12" />
  </svg>
);

export const SpeakerMuteIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M4 9v6h4l5 4V5L8 9H4Z" />
    <path d="m16 9 5 6M21 9l-5 6" />
  </svg>
);

export const SendIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M21 3 3 10.5l7.5 2.9L13.5 21 21 3Z" />
    <path d="M10.5 13.4 21 3" />
  </svg>
);

export const CheckIcon = (props) => (
  <svg {...base} {...props}>
    <path d="m5 12 5 5 9-11" />
  </svg>
);

export const GlobeIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
  </svg>
);
