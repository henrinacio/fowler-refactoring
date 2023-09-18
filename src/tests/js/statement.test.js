import { expect, test } from 'vitest'
import { statement } from '../../assets/js/statement'
import invoices from '../../data/invoices.json'
import plays from '../../data/plays.json'

test('create statement', () => {
  expect(statement(invoices, plays)).toBe('Statement for BigCo\n Hamlet: $650.00 (55 seats)\n As You Like It: $490.00 (35 seats)\n Othello: $500.00 (40 seats)\nAmount owed is $1,640.00\nYou earned 47 credits\n')
})
