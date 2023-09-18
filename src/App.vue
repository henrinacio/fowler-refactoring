<script setup>

import invoiceData from './data/invoices.json'
import playsData from './data/plays.json'
import { statement } from './assets/js/statement'

const result = statement(invoiceData, playsData)
</script>

<template>
  <div class="test">{{ result }}</div>
</template>

<style scoped>
.test {
  white-space: pre;
}
</style>
