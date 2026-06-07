interface Props {
  adjust: number
  onDismiss: () => void
}

export function ThermalAutoNotice({ adjust, onDismiss }: Props) {
  if (adjust === 0) return null

  const text = adjust > 0
    ? "Tu as souvent eu trop chaud — Météfit a ajusté tes suggestions vers le frais."
    : "Tu as souvent eu trop froid — Météfit a ajusté tes suggestions vers le chaud."

  return (
    <div className="flex items-start gap-2 bg-purple-50 border border-purple-200 rounded-xl px-3 py-2.5">
      <span className="text-base flex-shrink-0">🧠</span>
      <p className="text-xs text-purple-800 leading-snug flex-1">{text}</p>
      <button onClick={onDismiss} className="text-purple-300 hover:text-purple-500 text-sm flex-shrink-0">✕</button>
    </div>
  )
}
