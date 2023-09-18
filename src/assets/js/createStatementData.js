export default function createStatementData (invoice, plays) {
  const result = {}

  result.customer = invoice.customer
  result.performances = invoice.performances.map(enrichPerformance)
  result.totalAmount = totalAmount(result)
  result.totalVolumeCredits = totalVolumeCredits(result)

  return result

  function totalAmount (data) {
    return data.performances.reduce((total, previous) => total + previous.amount, 0)
  }

  function totalVolumeCredits (data) {
    return data.performances.reduce((total, previous) => total + previous.volumeCredits, 0)
  }

  function enrichPerformance (aPerformance) {
    const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance))
    const result = Object.assign({}, aPerformance)

    result.play = calculator.play
    result.amount = calculator.amount
    result.volumeCredits = volumeCreditsFor(result)

    return result
  }

  function volumeCreditsFor (aPerformance) {
    let result = 0

    // soma créditos por volume
    result += Math.max(aPerformance.audience - 30, 0)

    // soma um crédito extra para cada dez espectadores de comédia
    if (aPerformance.play.type === 'comedy') {
      result += Math.floor(aPerformance.audience / 5)
    }

    return result
  }

  function playFor (aPerformance) {
    return plays[aPerformance.playID]
  }
}

class PerformanceCalculator {
  constructor (aPerformance, aPlay) {
    this.performance = aPerformance
    this.play = aPlay
  }

  get amount () {
    let result = 0

    switch (this.play.type) {
      case 'tragedy':
        result = 40_000
        if (this.performance.audience > 30) {
          result += 1_000 * (this.performance.audience - 30)
        }
        break
      case 'comedy':
        result = 30_000
        if (this.performance.audience > 20) {
          result += 1_000 + 500 * (this.performance.audience - 20)
        }
        result += 300 * this.performance.audience
        break
      default:
        throw new Error(`unknow type: ${this.play.type}`)
    }

    return result
  }
}
