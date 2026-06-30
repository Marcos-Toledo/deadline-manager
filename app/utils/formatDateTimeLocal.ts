const pad = (num: number) => String(num).padStart(2, "0");
export const formatDateTimeLocal = (d: Date) => {
  const ano = d.getUTCFullYear();
  const mes = pad(d.getUTCMonth() + 1); // Meses começam em 0
  const dia = pad(d.getUTCDate());
  const hora = pad(d.getUTCHours());
  const minuto = pad(d.getUTCMinutes());

  return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
};
