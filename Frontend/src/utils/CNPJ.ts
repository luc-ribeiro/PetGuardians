export function formatCnpj(value: string) {
  const notFormattedCnpj = value

  const formattedCnpj = notFormattedCnpj
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')

  const cleanCnpj = formattedCnpj.replace(/\D/g, '')

  return [cleanCnpj, formattedCnpj]
}
