export default function Toast({ mensaje, visible }) {
  return (
    <div className={`fixed bottom-36 left-1/2 -translate-x-1/2 z-50 bg-action px-6 py-3 rounded-xl shadow-lg transition-all duration-300 ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
    }`}>
      <p className="font-saira text-sm text-identity font-semibold whitespace-nowrap">{mensaje}</p>
    </div>
  );
}
