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

  function volumeCreditsFor (aPerformance) {
    let result = 0

    // soma créditos por volume
    result += Math.max(aPerformance.audience - 30, 0)

    // soma um crédito extra para cada dez espectadores de comédia
    if (playFor(aPerformance).type === 'comedy') {
      result += Math.floor(aPerformance.audience / 5)
    }

    return result
  }

  for (const perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf)

    // exibe a linha para esta requisição
    result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats)\n`
    totalAmount += amountFor(perf)
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`
  result += `You earned ${volumeCredits} credits\n`

  return result
}
