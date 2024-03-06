<template>
  <div>
    <span
      v-for="d in data"
      :key="d.text"
    >
      <p
        v-for="f in fields"
        :key="f.key"
      >
        {{ f.title }} - {{ formatValue(d, f) }}
      </p></span>{{ selected }}
    <d-data-table
      v-model="selected"
      :data="data"
      :columns="fields"
      editable
      selectable
      return-object
      :row-key="(row) => row.text"
      selected-class="selected"
    />{{ data[0] }}
    <d-input
      v-for="f in fields"
      :key="f.key"
      v-model="data[0][f.key]"
      form
      :field="f"
    />
  </div>
</template>
<script setup>
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
]);
</script>
<style scoped>
:deep(.selected td) {
  background-color: black !important;
}
</style>
