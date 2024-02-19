<template>
  <n-data-table
    ref="mainTable"
    :data="items"
    :columns="cols"
    :pagination="page"
    :row-class-name="getRowClass"
    :row-props="
      (rowData, rowIndex) => ({
        onClick: () => {
          if (selectable) {
            if (selected == rowData) selected = null;
            else selected = rowData;
          }
        },
      })
    "
    v-bind="$attrs"
    @update:expanded-row-keys="expanded"
  />
</template>
<script setup>
import { getValue, formatValue } from "../utils";
import Input from "./input.vue";
import {
  SearchOutline,
  CheckmarkCircleOutline,
  BanOutline,
  CalendarClearOutline,
  Warning,
  AddOutline,
  PencilOutline,
  CloseCircleOutline,
  TrashOutline,
} from "@vicons/ionicons5";
import { ExpandSharp } from "@vicons/material";
import {
  NSpace,
  NIcon,
  NInput,
  NButton,
  NDatePicker,
  NInputNumber,
} from "naive-ui";

const props = defineProps({
  data: {
    type: Array,
    required: false,
    default: () => [],
  },
  columns: {
    type: Array,
    required: true,
  },
  modelValue: {
    required: false,
    type: Object,
    default: () => {},
  },
  selectable: {
    type: Boolean,
  },
  pagination: {
    type: [Object, Boolean],
    required: false,
    default: () => false,
  },
  editable: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const items = computed(() => {
  const temp = !props.data
    ? []
    : props.data.map((item) => {
        return { ...item };
      });
  if (editedRow.value && editedIndex.value < 0) temp.unshift(editedRow.value);
  return temp;
});

const attrs = useAttrs();
const page = computed(() => {
  if (!props.pagination && props.pagination != false) {
    return {
      defaultPageSize: 15,
      showSizePicker: true,
      pageSizes: [10, 25, 50, items.value.length],
      showQuickJumper: true,
      disabled: props.editable && items.value.some((i) => i.editable),
    };
  }
  return props.pagination;
});
const expandedKeys = ref([]);
const expanded = (data) => {
  expandedKeys.value = data;
  emit("update:expanded", data);
};

const selected = ref({});
const editedRow = ref(null);
const editedIndex = ref(null);
const emit = defineEmits([
  "update:modelValue",
  "update:expanded",
  "put",
  "delete",
]);

watch(
  selected,
  (newValue) => {
    emit("update:modelValue", newValue);
  },
  { deep: true }
);
function getRowClass(rowData) {
  let classes = "";
  if (rowData.disabled) classes += " disabledRow ";
  if (
    attrs["row-key"] &&
    expandedKeys.value.indexOf(attrs["row-key"](rowData)) >= 0
  )
    classes += " font-weight-bold ";
  if (selected && selected.value == rowData && rowData.descricao != "Total:") {
    classes += " selectedRow ";
  }
  return classes;
}

const cols = computed(() => {
  const columns = [...props.columns];
  columns.forEach((field) => {
    field.render = (row, index) => {
      if (
        props.editable &&
        (index == editedIndex.value || row.new) &&
        (!field.pk || row.new) &&
        !field.auto
      )
        return h(Input, {
          modelValue: editedRow.value[field.key],
          field: { ...field, label: null, title: null },
          "onUpdate:modelValue": (value) =>
            (editedRow.value[field.key] = value),
        });
      else if (field.type == "bool") {
        if (row[field.key] == true)
          return h(
            NIcon,
            { color: "green", size: 18 },
            { default: () => h(CheckmarkCircleOutline) }
          );
        else if (row[field.key] == false)
          return h(
            NIcon,
            { color: "red", size: 18 },
            { default: () => h(BanOutline) }
          );
        else
          return h(
            NIcon,
            { color: "orange", size: 18 },
            { default: () => h(Warning) }
          );
      }
      return formatValue(row, field);
    };
    if (field.type == "bool") {
      field.filterOptions = [
        { label: "Y", value: true },
        { label: "N", value: false },
      ];
      field.filter = (value, row) => {
        return getValue(row, field) == value;
      };
    } else if (field.type == "select") {
      let temp = field.options;
      if (!temp)
        temp = [...new Set(items.value.map((o) => getValue(o, field)))]
          .sort()
          .map((o) => {
            return o
              ? {
                  label:
                    typeof o === "string"
                      ? o.charAt(0).toUpperCase() + o.slice(1)
                      : "N/A",
                  value: o,
                }
              : {};
          });
      field.filterOptions = temp;
      field.filter = (value, row) => {
        return getValue(row, field) == value;
      };
    } else if (["date", "month", "year"].indexOf(field.type) >= 0) {
      field.filterOptionValue = null;
      field.renderFilterIcon = () => {
        return h(NIcon, null, { default: () => h(CalendarClearOutline) });
      };
      field.filter = (value, row) => {
        const v = new Date(getValue(row, field));
        return (
          !field.filterOptionValue ||
          (row[field.key] &&
            v >= new Date(field.filterOptionValue[0]) &&
            v <= new Date(field.filterOptionValue[1]))
        );
      };
      field.renderFilterMenu = ({ hide }) => {
        return h(
          NSpace,
          { style: { padding: "12px" }, vertical: true },
          {
            default: () => [
              h(NDatePicker, {
                type: "daterange",
                value: field.filterOptionValue,
                format: "dd/MM/yyyy",
                clearable: true,
                onConfirm: ([min, max]) => {
                  field.filterOptionValue = [min, max];
                  hide();
                },
              }),
              h(
                NButton,
                {
                  size: "tiny",
                  onClick: () => {
                    field.filterOptionValue = null;
                    hide();
                  },
                },
                { default: () => "Clear" }
              ),
            ],
          }
        );
      };
    } else if (field.type == "number") {
      field.filterOptionValue = null;
      field.filter = (value, row) => {
        const v = getValue(row, field);
        return (
          !field.filterOptionValue ||
          (!field.filterOptionValue[0] | (v >= field.filterOptionValue[0]) &&
            !field.filterOptionValue[1] | (v <= field.filterOptionValue[1]))
        );
      };
      field.renderFilterIcon = () => {
        return h(NIcon, null, { default: () => h(ExpandSharp) });
      };
      field.renderFilterMenu = ({ hide }) => {
        return h(
          NSpace,
          { style: { padding: "12px" }, vertical: true },
          {
            default: () => [
              h(NInputNumber, {
                placeholder: "Min",
                value: field.filterOptionValue
                  ? field.filterOptionValue[0]
                  : null,
                onKeyup: (key) => {
                  if (key.code == "Enter") hide();
                },
                onUpdateValue: (text) => {
                  if (!field.filterOptionValue)
                    field.filterOptionValue = [null, null];
                  field.filterOptionValue[0] = text;
                },
              }),
              h(NInputNumber, {
                placeholder: "Max",
                value: field.filterOptionValue
                  ? field.filterOptionValue[1]
                  : null,
                onKeyup: (key) => {
                  if (key.code == "Enter") hide();
                },
                onUpdateValue: (text) => {
                  if (!field.filterOptionValue)
                    field.filterOptionValue = [null, null];
                  field.filterOptionValue[1] = text;
                },
              }),
              h(
                NButton,
                {
                  size: "tiny",
                  onClick: () => {
                    field.filterOptionValue = null;
                    hide();
                  },
                },
                { default: () => "Clear" }
              ),
            ],
          }
        );
      };
    } else {
      field.filterOptionValue = null;
      field.filter = (value, row) => {
        const v = getValue(row, field);
        return (
          !value || (v && v.toLowerCase().indexOf(value.toLowerCase()) >= 0)
        );
      };
      field.renderFilterIcon = () => {
        return h(NIcon, null, { default: () => h(SearchOutline) });
      };
      field.renderFilterMenu = ({ hide }) => {
        return h(
          NSpace,
          { style: { padding: "12px" }, vertical: true },
          {
            default: () => [
              h(NInput, {
                placeholder: "",
                value: field.filterOptionValue,
                onKeyup: (key) => {
                  if (key.code == "Enter") hide();
                },
                onInput: (text) => {
                  field.filterOptionValue = text;
                },
              }),
              h(
                NButton,
                {
                  size: "tiny",
                  onClick: () => {
                    field.filterOptionValue = null;
                    hide();
                  },
                },
                { default: () => "Clear" }
              ),
            ],
          }
        );
      };
    }
  });
  if (props.editable) {
    const col = {
      key: "actions",
      filter: false,
      title: () => {
        return h(
          NButton,
          {
            circle: true,
            strong: true,
            tertiary: true,
            type: "success",
            onClick: () => {
              editedRow.value = { new: true };
              editedIndex.value = -1;
            },
          },
          {
            icon: () =>
              h(
                NIcon,
                {
                  color: "green",
                  size: 24,
                },
                {
                  default: () => h(AddOutline),
                }
              ),
          }
        );
      },
      render: (row, index) => {
        return editedIndex.value == index || row.new
          ? [
              h(
                NButton,
                {
                  circle: true,
                  strong: true,
                  tertiary: true,
                  type: "success",
                  onClick: () => {
                    dialog.warning({
                      title: `Confirmação de ${
                        row.new ? "Inclusão" : "Alteração"
                      }`,
                      content: `Tem certeza que deseja efetuar ${
                        row.new ? "a Inclusão" : "as alterações"
                      }?`,
                      positiveText: "SIM",
                      negativeText: "NÃO",
                      onPositiveClick: () => {
                        message.success(
                          `Item ${
                            row.new ? "incluido" : "alterado"
                          } com sucesso`
                        );
                        emit("put", tempItem);
                        editedIndex.value = null;
                        editedRow.value = -1;
                      },
                    });
                  },
                },
                {
                  icon: () =>
                    h(
                      NIcon,
                      { color: "green", size: 22 },
                      {
                        default: () => h(CheckmarkCircleOutline),
                      }
                    ),
                }
              ),
              h(
                NButton,
                {
                  circle: true,
                  strong: true,
                  tertiary: true,
                  type: "warning",
                  onClick: () => {
                    editedIndex.value = -1;
                    editedRow.value = null;
                  },
                },
                {
                  icon: () =>
                    h(
                      NIcon,
                      { color: "orange", size: 22 },
                      {
                        default: () => h(CloseCircleOutline),
                      }
                    ),
                }
              ),
              h(
                NButton,
                {
                  circle: true,
                  strong: true,
                  tertiary: true,
                  type: "error",
                  onClick: () => {
                    dialog.error({
                      title: "Confirmação de Exclusão",
                      content: "Tem certeza que deseja deletar este item?",
                      positiveText: "SIM",
                      negativeText: "NÃO",
                      onPositiveClick: () => {
                        message.success("Item removido com sucesso");
                        emit("delete", editedRow.value);
                        editedIndex.value = -1;
                        editedRow.value = null;
                      },
                    });
                  },
                },
                {
                  icon: () =>
                    h(
                      NIcon,
                      { color: "red", size: 22 },
                      {
                        default: () => h(TrashOutline),
                      }
                    ),
                }
              ),
            ]
          : h(
              NButton,
              {
                circle: true,
                strong: true,
                tertiary: true,
                type: "info",
                onClick: () => {
                  editedIndex.value = index;
                  editedRow.value = ref(structuredClone(toRaw(row))).value;
                },
              },
              {
                icon: () =>
                  h(
                    NIcon,
                    {
                      color: "blue",
                      size: 20,
                    },
                    { default: () => h(PencilOutline) }
                  ),
              }
            );
      },
    };
    if (columns.some((f) => f.key == "actions")) columns.splice(-1);
    columns.push(col);
  }
  return columns;
});
const mainTable = ref("");
watch(
  () => props.data,
  (first) => {
    if (first.length >= 0) {
      if (mainTable.value) mainTable.value.page(1);
    }
  }
);
</script>
<style scoped>
:deep(.selectedRow td) {
  background-color: rgba(33, 43, 89, 0.2) !important;
  /* color: white !important; */
}

:deep(.disabledRow td) {
  color: red !important;
}
</style>