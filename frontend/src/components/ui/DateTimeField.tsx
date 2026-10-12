interface Props {
  label: string;
  dateName: string;
  clockName: string;
  required?: boolean;
}

const input = "field mt-1 text-white [color-scheme:dark]";
const caption = "block text-[11px] text-white/50";

export function DateTimeField({ label, dateName, clockName, required }: Props) {
  return (
    <fieldset className="mt-3 min-w-0">
      <legend className="text-xs text-white/60">{label}</legend>
      <div className="mt-1 grid grid-cols-[1fr_7.5rem] gap-2">
        <label className={caption}>
          Ngày
          <input
            type="date"
            name={dateName}
            required={required}
            className={input}
          />
        </label>
        <label className={caption}>
          Giờ
          <input
            type="time"
            name={clockName}
            required={required}
            className={input}
          />
        </label>
      </div>
    </fieldset>
  );
}
