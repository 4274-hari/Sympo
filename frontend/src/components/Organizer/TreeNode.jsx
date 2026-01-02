export function TreeNode({ title, name, role }) {
  return (
    <div className={`relative flex flex-col items-center animate-[float_8s_ease-in-out_infinite] ${title === "Patron" ? "mt-14 lg:mt-0" : ""}`}>

      {/* title */}
      <h2 className="text-2xl tracking-[0.25em] uppercase text-[#CEA2FD]/80 mb-3">
        {title}
      </h2>

      {/* stem */}
      <div className="w-[1.5px] h-18 bg-[#CEA2FD]/60 mb-4" />

      {/* card */}
      <div
        className="
        relative w-86 text-center rounded-xl px-6 py-4
        bg-[linear-gradient(180deg,rgba(40,20,70,0.65),rgba(15,8,30,0.65))]
        backdrop-blur-xl
        border border-[rgba(206,162,253,0.22)]
        shadow-[0_0_32px_rgba(137,104,205,0.45)]
        transition-all duration-500
        hover:shadow-[0_0_55px_rgba(206,162,253,0.75)]
      "
      >
        {/* hanging connector */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[1.5px] h-3 bg-[#CEA2FD]/70" />

        <h3 className="text-lg text-[#CEA2FD] font-medium">
          {name}
        </h3>
        <p className="mt-1 text-sm text-white/80">
          {role}
        </p>

        {/* inner glow */}
        <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle,rgba(206,162,253,0.18),transparent_70%)] opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </div>
  );
}