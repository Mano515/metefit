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
    <div className="flex items-start gap-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl px-3 py-2.5">
      <span className="text-base flex-shrink-0">🧠</span>
      <p className="text-xs text-purple-800 dark:text-purple-300 leading-snug flex-1">{text}</p>
      <button onClick={onDismiss} className="text-purple-300 dark:text-purple-600 hover:text-purple-500 dark:hover:text-purple-400 text-sm flex-shrink-0">✕</button>
    </div>
  )
}
