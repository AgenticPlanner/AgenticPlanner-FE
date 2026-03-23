export default function AddTaskPlaceholder() {
  return (
    <button
      className="group bg-transparent border-2 border-dashed border-outline-variant rounded-xl p-8
        flex flex-col items-center justify-center hover:border-primary transition-colors cursor-pointer
        h-full min-h-80"
    >
      {/* Icon circle */}
      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary-container transition-colors duration-300">
        <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors duration-300">add</span>
      </div>

      {/* Label */}
      <span className="font-body font-bold text-on-surface-variant group-hover:text-primary transition-colors duration-300">
        마일스톤 추가
      </span>
    </button>
  );
}
