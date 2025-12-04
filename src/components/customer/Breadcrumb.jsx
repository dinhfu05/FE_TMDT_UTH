import React from "react";
import { ChevronRight } from "lucide-react";

const Breadcrumb = ({ paths }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-none mb-6 text-sm text-gray-600 flex items-center gap-1">
      {paths.map((path, index) => (
        <span key={index} className="flex items-center gap-1">
          <span
            className={index === paths.length - 1 ? "font-semibold text-black" : "hover:underline cursor-pointer"}
            onClick={() => path.link && (window.location.href = path.link)}
          >
            {path.label}
          </span>
          {index < paths.length - 1 && <ChevronRight size={16} />}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
