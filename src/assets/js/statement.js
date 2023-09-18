export function statement (invoice, plays) {
  return renderPlainText(invoice, plays)
}

function renderPlainText (invoice, plays) {
  let result = `Statement for ${invoice.customer}\n`

  for (const perf of invoice.performances) {
    // exibe a linha para esta requisição
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`
  }

  result += `Amount owed is ${usd(totalAmount())}\n`
  result += `You earned ${totalVolumeCredits()} credits\n`

  function totalAmount () {
    let result = 0

    for (const perf of invoice.performances) {
      result += amountFor(perf)
    }

    return result
  }

  function totalVolumeCredits () {
    let result = 0

    for (const perf of invoice.performances) {
      result += volumeCreditsFor(perf)
    }

    return result
  }

  function usd (aNumber) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(aNumber / 100)
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

  function playFor (aPerformance) {
    return plays[aPerformance.playID]
  }

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

  return result
}
