import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

// Editores de listas del formulario de paquetes (como en Cia Travel).
// Cada uno guarda su valor como JSON en un campo oculto con `name`.

const iconButton = "grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#e4e7ec] text-[#667085] transition hover:bg-[#f6f7f9] disabled:opacity-30";
const addButton = "inline-flex w-fit items-center gap-1.5 rounded-xl border border-dashed border-[#d4952a] px-4 py-2 text-sm font-semibold text-[#8a5a08] transition hover:bg-[#fdf6e7]";

function move<T>(list: T[], index: number, delta: number) {
  const next = [...list];
  [next[index], next[index + delta]] = [next[index + delta], next[index]];
  return next;
}

function RowActions({ index, length, onMove, onRemove }: { index: number; length: number; onMove: (delta: number) => void; onRemove: () => void }) {
  return (
    <div className="flex shrink-0 gap-1">
      <button type="button" title="Subir" disabled={index === 0} onClick={() => onMove(-1)} className={iconButton}><ArrowUp className="h-3.5 w-3.5" /></button>
      <button type="button" title="Bajar" disabled={index === length - 1} onClick={() => onMove(1)} className={iconButton}><ArrowDown className="h-3.5 w-3.5" /></button>
      <button type="button" title="Quitar" onClick={onRemove} className={`${iconButton} hover:border-red-200 hover:bg-red-50 hover:text-red-600`}><Trash2 className="h-3.5 w-3.5" /></button>
    </div>
  );
}

/** Lista de textos cortos (qué incluye / no incluye). */
export function TextListField({ name, defaultValue = [], placeholder, addLabel }: { name: string; defaultValue?: string[]; placeholder: string; addLabel: string }) {
  const [items, setItems] = useState(defaultValue);
  const clean = items.map((item) => item.trim()).filter(Boolean);
  return (
    <div className="grid gap-2">
      <input type="hidden" name={name} value={JSON.stringify(clean)} />
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input value={item} maxLength={200} placeholder={placeholder} onChange={(e) => setItems(items.map((x, j) => (j === i ? e.target.value : x)))} className="field min-w-0 flex-1" />
          <RowActions index={i} length={items.length} onMove={(d) => setItems(move(items, i, d))} onRemove={() => setItems(items.filter((_, j) => j !== i))} />
        </div>
      ))}
      <button type="button" onClick={() => setItems([...items, ""])} className={addButton}><Plus className="h-4 w-4" /> {addLabel}</button>
    </div>
  );
}

type Pair = { title: string; text: string };

/** Lista de pares título + texto (itinerario y preguntas frecuentes). */
export function PairListField({
  name,
  defaultValue = [],
  titlePlaceholder,
  textPlaceholder,
  addLabel,
  numbered = false,
}: {
  name: string;
  defaultValue?: Pair[];
  titlePlaceholder: string;
  textPlaceholder: string;
  addLabel: string;
  numbered?: boolean;
}) {
  const [items, setItems] = useState(defaultValue);
  const clean = items.map((item) => ({ title: item.title.trim(), text: item.text.trim() })).filter((item) => item.title || item.text);
  const update = (i: number, patch: Partial<Pair>) => setItems(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={JSON.stringify(clean)} />
      {items.map((item, i) => (
        <div key={i} className="flex gap-3 rounded-2xl border border-[#eaecf0] bg-[#fcfcfd] p-3">
          {numbered ? <span className="mt-1.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#d4952a] text-xs font-bold text-[#021623]">{i + 1}</span> : null}
          <div className="grid min-w-0 flex-1 gap-2">
            <input value={item.title} maxLength={140} placeholder={titlePlaceholder} onChange={(e) => update(i, { title: e.target.value })} className="field font-semibold" />
            <textarea value={item.text} rows={2} maxLength={2000} placeholder={textPlaceholder} onChange={(e) => update(i, { text: e.target.value })} className="field" />
          </div>
          <RowActions index={i} length={items.length} onMove={(d) => setItems(move(items, i, d))} onRemove={() => setItems(items.filter((_, j) => j !== i))} />
        </div>
      ))}
      <button type="button" onClick={() => setItems([...items, { title: numbered && !items.length ? "Día 1" : "", text: "" }])} className={addButton}><Plus className="h-4 w-4" /> {addLabel}</button>
    </div>
  );
}
