export function formatCep(value: string) {
  const notFormattedCep = value
  const formattedCep = notFormattedCep
  .replace(/\D/g, '')
  .replace(/(\d{5})(\d)/, '$1-$2')
  .replace(/(-\d{3})\d+?$/, '$1')
  const cleanCnpj = formattedCep.replace(/\D/g, '')
  return [cleanCnpj, formattedCep]
}