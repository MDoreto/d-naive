<template>
  <div>
    <span v-for="d in data" :key="d.text">
      <p v-for="f in fields" :key="f.key">
        {{ f.title }} - {{ formatValue(d, f) }}
      </p>
    </span>{{ selected }}
    <d-data-table v-model="selected" :data="data" :columns="fields" editable selectable return-object
      :row-key="(row) => row.text" selected-class="selected" ref="table"/>{{ data[0] }}
      <n-button @click="reset()">clear</n-button>
    <d-input v-for="f in fields" :key="f.key" v-model="data[0][f.key]" form v-bind="f" />
  </div>
</template>
<script setup>
const table = ref();
const reset = () => {
  table.value.resetFilters();
};
const selected = ref();
const data = ref([
  {
    text: "Texto",
    currency: 2343.56,
    date: "2022-12-12",
    bool: true,
    category: "pending",
    percent: 45,
    int: 4,
    year: "2024",
    number: 2.53432,
    datetime: "2004-02-26 11:55:14.000"
  },
  {
    text: "Abd",
    currency: 2343.56,
    date: "2032-12-12",
    bool: false,
    category: "ok",
    percent: 80,
    int: 2,
    year: "2029",
    children: [
      {
        text: "vvvvvvvvvvvvvvvv",
        currency: 2343.56,
        date: "2022-12-12",
        bool: true,
        category: "pending",
        percent: 45,
        int: 4,
        year: "2024",
      },
    ],
  },
  {
    text: "cccccccccccc",
    currency: 2343.56,
    date: "2022-12-12",
    bool: true,
    category: "pending",
    percent: 45,
    int: 4,
    year: "2024",
  },
]);
const fields = ref([
  {
    title: "Texto",
    key: "text",
  },
  { title: "Moeda", key: "currency", type: "number", prefix: "R$" },
  { title: "Number", key: "number", type: "number", maxPrecision: 1 },
  { title: "Data", key: "date", type: "date" },
  { title: "Boolean", key: "bool", type: "bool" },
  {
    label: "Categorias",
    title: "Categoria",
    key: "category",
    type: "select",
    options: ["pending", "ok"],
  },
  { title: "Porcentagem", key: "percent", type: "number", suffix: "%" },
  { title: "Inteiro", key: "int", type: "number", precision: 0 },
  {
    title: "Ano",
    key: "year",
    type: "year",
    format: "yyyy",
    valueFormat: "yyyy",
  },
  {title:"datetime", key:"datetime", type:"datetime", format:"dd/MM/yyyy HH:mm:ss.SSS"}
]);
</script>
<style scoped>
:deep(.selected td) {
  background-color: black !important;
}
</style>
