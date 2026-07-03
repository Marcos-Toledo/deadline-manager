export function formatarProcessoCNJ(valor: string): string {
  // Remove tudo o que não for dígito numérico
  let apenasNumeros = valor.replace(/\D/g, "");

  // Limita ao máximo de 20 dígitos do padrão CNJ
  apenasNumeros = apenasNumeros.substring(0, 20);

  // Aplica a máscara por partes de acordo com o tamanho do texto
  return apenasNumeros
    .replace(/^(\d{7})(\d)/, "$1-$2")
    .replace(/^(\d{7}-\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{7}-\d{2}\.\d{4})(\d)/, "$1.$2")
    .replace(/^(\d{7}-\d{2}\.\d{4}\.\d{1})(\d)/, "$1.$2")
    .replace(/^(\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2})(\d)/, "$1.$2");
}

// Exemplo de uso:
// const textoPuro = "00012345620248260127";
// console.log(formatarProcessoCNJ(textoPuro));
// Resultado: 0001234-56.2024.8.26.0127
