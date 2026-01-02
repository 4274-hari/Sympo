import useInViewOnce from "../../hooks/useOnceView";
import { TreeNode } from "./TreeNode";

export default function Organizer() {
  const [ref, visible] = useInViewOnce();

  return (
    <section
      ref={ref}
      className="relative w-full py-16 flex justify-center overflow-hidden"
    >
      {/* rope illusion */}
      {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-12 md:h-32  bg-[#CEA2FD]/50" /> */}

      <div
        className={`
          relative flex flex-col-reverse md:flex-row-reverse items-center md:gap-40
          origin-top
          ${visible ? "animate-drop animate-wave" : "opacity-0"}
        `}
      >
        {/* horizontal branch */}
        <div className="hidden md:block absolute top-[64px] left-1/2 -translate-x-1/2 w-[60%] h-[1.5px] bg-[#CEA2FD]/60" />
        
        <TreeNode
          title="Convener"
          name="Dr. P. Visu"
          role="Professor & Head,"
          dept="Department of AI & DS"
        />

        <TreeNode
          title="Patron"
          name="Dr. S. Sathish Kumar"
          role="Principal"
        />

      </div>
    </section>
  );
}