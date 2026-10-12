export function Field({ label, name, ...rest }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="mt-3 block text-xs text-white/60" htmlFor={name}>
      {label}
      <input id={name} name={name} className="field mt-1 text-white" {...rest} />
    </label>
  );
}
