
// import { Link } from "react-router-dom";
// import { ArrowRight, Layers, Shuffle } from "lucide-react";

// /**
//  * "What would you like to do?" screen
//  */
// export default function StartChoice() {
//   return (
//     // <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
// <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-section-bg to-background p-4 relative overflow-hidden">
//   {/* Decorative background glow — same as platform picker */}
//   <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-hero-from/20 blur-3xl" />
//   <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-hero-to/20 blur-3xl" />
//   <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />

//   <div className="w-full max-w-5xl relative z-10"></div>
//       <div className="mx-auto w-full max-w-4xl text-center">
//         {/* <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
//           What would you like to do?
//         </h1> */}

//         {/* <h1 className="text-center text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
//           What would you like to do?
//         </h1>
//         <p className="mt-4 max-w-2xl mx-auto text-base text-muted-foreground sm:text-lg">
//           Build a data job with the guided Veriton workflow, or map an existing
//           source system straight into the UDM you already have.
//         </p> */}
//         <div className="text-center mb-12">
//             <h1 className="text-5xl font-bold mb-4 leading-[1.2] pb-1 bg-gradient-to-r from-hero-from to-hero-to bg-clip-text text-transparent">
//                 What would you like to do?
//             </h1>
//             <p className="text-muted-foreground max-w-lg mx-auto text-base">
//                 Build a data job with the guided Veriton workflow, or map an existing
//                 source system straight into the UDM you already have.
//             </p>
//             </div>
//       </div>

//       {/* <div className="mt-12 grid w-full max-w-4xl gap-6 md:grid-cols-2"> */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
//         <ChoiceCard
//           to="/jobs"
//           icon={<Layers className="h-7 w-7" />}
//           title="Create a Job"
//           desc="Ingest, model and publish data with the guided Veriton workflow."
//           cta="Go to Jobs"
//         />
//         <ChoiceCard
//           to="/modernize-data"
//           icon={<Shuffle className="h-7 w-7" />}
//           title="Modernize Data"
//           desc="Map a source system into your UDM — AI proposes, you approve."
//           cta="Start modernization"
//         />
//       </div>
//     </div>
 
//   );
// }

// function ChoiceCard({
//   to,
//   icon,
//   title,
//   desc,
//   cta,
// }: {
//   to: string;
//   icon: React.ReactNode;
//   title: string;
//   desc: string;
//   cta: string;
// }) {
//   return (
//     <Link
//       to={to}
//       className={[
//         "group relative flex flex-col items-start gap-6 rounded-3xl border p-8 text-left min-h-[280px] overflow-hidden",
//         "bg-card/70 backdrop-blur-sm transition-all duration-300 ease-out",
//         "hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10",
//         "border-border/80 hover:border-primary/50",
//       ].join(" ")}
//     >
//       {/* Soft radial glow on hover */}
//       <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-hero-from/0 to-hero-to/0 group-hover:from-hero-from/10 group-hover:to-hero-to/10 blur-2xl transition-all duration-500" />

//       {/* Gradient top border */}
//       <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-3xl bg-gradient-to-r from-hero-from to-hero-to opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//       <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-hero-from group-hover:to-hero-to group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20">
//         {icon}
//       </div>

//       <div className="relative flex-1">
//         <p className="text-xl font-semibold text-foreground mb-2.5 tracking-tight">
//           {title}
//         </p>
//         <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
//       </div>

//       <span className="relative mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary">
//         {cta}
//         <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//       </span>

//       {/* Hover indicator dot */}
//       <div className="absolute top-7 right-7 h-2.5 w-2.5 rounded-full bg-transparent scale-0 transition-all duration-300 group-hover:bg-primary/30 group-hover:scale-100" />
//     </Link>
//   );
// }


import { Link } from "react-router-dom";
import { ArrowRight, Layers, Shuffle } from "lucide-react";

/**
 * "What would you like to do?" screen
 */
export default function StartChoice() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-section-bg to-background px-6 py-12">

      {/* Decorative background glows */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-hero-from/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-hero-to/20 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-5xl">

        {/* Heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-hero-from to-hero-to bg-clip-text pb-1 text-5xl font-bold leading-[1.15] tracking-tight text-transparent sm:text-6xl">
            What would you like to do?
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Build a data job with the guided Veriton workflow, or map an existing
            source system straight into the UDM you already have.
          </p>
        </div>

        {/* Choice cards */}
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">

          <ChoiceCard
            to="/jobs"
            icon={<Layers className="h-7 w-7" />}
            title="Create a Job"
            desc="Ingest, model and publish data with the guided Veriton workflow."
            cta="Go to Jobs"
          />

          <ChoiceCard
            to="/modernize-data"
            icon={<Shuffle className="h-7 w-7" />}
            title="Modernize Data"
            desc="Map a source system into your UDM — AI proposes, you approve."
            cta="Start modernization"
          />

        </div>
      </div>
    </div>
  );
}

function ChoiceCard({
  to,
  icon,
  title,
  desc,
  cta,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta: string;
}) {
  return (
    <Link
      to={to}
      className={[
        "group relative flex min-h-[280px] flex-col overflow-hidden rounded-3xl border p-8 text-left",
        "border-border/80 bg-card/70 backdrop-blur-sm",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10",
      ].join(" ")}
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-hero-from/0 to-hero-to/0 blur-2xl transition-all duration-500 group-hover:from-hero-from/10 group-hover:to-hero-to/10" />

      {/* Gradient top border */}
      <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-3xl bg-gradient-to-r from-hero-from to-hero-to opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Icon */}
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-hero-from group-hover:to-hero-to group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20">
        {icon}
      </div>

      {/* Text */}
      <div className="relative mt-6 flex-1">
        <h2 className="mb-2.5 text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {desc}
        </p>
      </div>

      {/* CTA */}
      <span className="relative mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        {cta}

        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>

      {/* Hover indicator */}
      <div className="absolute right-7 top-7 h-2.5 w-2.5 scale-0 rounded-full bg-transparent transition-all duration-300 group-hover:scale-100 group-hover:bg-primary/30" />
    </Link>
  );
}