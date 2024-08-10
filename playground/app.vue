<template>
  <div>
    <!-- <span v-for="d in data" :key="d.text">
      <p v-for="f in fields" :key="f.key">
        {{ f.title }} - {{ formatValue(d, f) }}
      </p> </span
    >{{ selected }} -->
    <n-button @click="filter()">
      filter
    </n-button>
    <d-data-table
      ref="table"
      v-model="selected"
      :data="data"
      :columns="fields"
      editable
      selectable
      return-object
      :row-key="(row) => row.id"
      selected-class="selected"
    />{{ data[0] }}
    <n-button @click="reset()">
      clear
    </n-button>
    <d-input
      v-for="f in fields"
      :key="f.key"
      v-model="data[0][f.key]"
      form
      v-bind="f"
    />
  </div>
</template>
<script setup>
const table = ref();
const reset = () => {
  table.value.resetFilters();
};
const filter = () => {
table.value.cols[1].setFilter("1616")

};
const selected = ref();
const data = ref([
  {
    id: '9999992',
    text: "Texto",
    currency: 2343.56,
    date: "2012-12-12",
    bool: true,
    category: "pending",
    percent: 45,
    int: 4,
    year: "2024",
    number: 2.53432,
    datetime: "2004-02-26 11:55:14.000",
  },
  {
    id: "9999999",
    text: null,
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
    id: "9999989999",
    text: undefined,
    currency: 2343.56,
    date: "2022-12-12",
    bool: true,
    category: "pending",
    percent: 45,
    int: 4,
    year: "2024",
  },
]);

for (let i = 0; i < 10000; i++) {
  data.value.push({
    id: i.toString(),
    text: "Texto",
    currency: 2343.56,
    date: "2022-12-12",
    bool: true,
    category: "pending",
    percent: 45,
    int: 4,
    year: "2024",
    number: 2.53432,
    datetime: "2004-02-26 11:55:14.000",
  });
}

const fields = ref([
  { type: "selection" },
  { title: "ID", key: "id", onUpdateFilters: (value) => console.log(value),noFormat: true},
  {
    title: "Texto",
    key: "text",
  },
  { title: "Moeda", key: "currency", type: "number", prefix: "R$" },
  { title: "Number", key: "number", type: "number" },
  { title: "Data", key: "date", type: "date" },
  { title: "Boolean", key: "bool", type: "bool" },
  {
    label: "Categorias",
    title: "Categoria",
    key: "category",
    options: ["pending", "ok"],
  },
  { title: "Porcentagem", key: "percent", type: "number", suffix: "%" },
  { title: "Inteiro", key: "int", type: "number", precision: 0 },
  // {
  //   title: "Ano",
  //   key: "year",
  //   type: "year",
  //   format: "yyyy",
  //   valueFormat: "yyyy",
  // },
  // {
  //   title: "datetime",
  //   key: "datetime",
  //   type: "datetime",
  //   format: "dd/MM/yyyy HH:mm:ss.SSS",
  // },
]);
</script>
<style scoped>
:deep(.selected td) {
  background-color: black !important;
}
</style>
