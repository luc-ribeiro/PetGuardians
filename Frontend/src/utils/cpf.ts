export function formatCpf(value: string) {
  const notFormattedCpf = value
  const formattedCpf = notFormattedCpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')

  return formattedCpf
}
