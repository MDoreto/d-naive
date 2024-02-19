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
      </p></span>
    <d-data-table
      :data="data"
      :columns="fields"
      editable
    />{{ data[0] }}
    <d-input
      v-for="f in fields"
      :key="f.key"
      v-model="data[0][f.key]"
      :field="f"
    />
  </div>
</template>

<script setup>
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
