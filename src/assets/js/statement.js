export function statement (invoice, plays) {
  let totalAmount = 0
  let volumeCredits = 0
  let result = `Statement for ${invoice.customer}\n`

  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format

  function amountFor (aPerformance) {
    let result = 0

    switch (playFor(aPerformance).type) {
      case 'tragedy':
        result = 40_000
        if (aPerformance.audience > 30) {
          result += 1_000 * (aPerformance.audience - 30)
        }
        break
      case 'comedy':
        result = 30_000
        if (aPerformance.audience > 20) {
          result += 1_000 + 500 * (aPerformance.audience - 20)
        }
        result += 300 * aPerformance.audience
        break
      default:
        throw new Error(`unknow type: ${playFor(aPerformance).type}`)
    }

    return result
  }

  function playFor (aPerformance) {
    return plays[aPerformance.playID]
  }

  for (const perf of invoice.performances) {
    // soma créditos por volume
    volumeCredits += Math.max(perf.audience - 30, 0)

    // soma um crédito extra para cada dez espectadores de comédia
    if (playFor(perf).type === 'comedy') {
      volumeCredits += Math.floor(perf.audience / 5)
    }

    // exibe a linha para esta requisição
    result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats)\n`
    totalAmount += amountFor(perf)
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`
  result += `You earned ${volumeCredits} credits\n`

  return result
}
