<template>
  <n-data-table
    ref="originTable"
    :data="items"
    :columns="cols"
    :pagination="page"
    :row-class-name="getRowClass"
    :row-props="rowProps"
    style="height: '100%'"
    :max-height="height"
    :scroll-x="scrollX ? scrollX * columns.length : '100%'"
    v-bind="$attrs"
    @update:expanded-row-keys="expanded"
  />
</template>
<script setup>
import { Icon } from "#components";

import {
  NSpace,
  NInput,
  NButton,
  NDatePicker,
  NInputNumber,
  NCheckbox,
  NVirtualList,
  createDiscreteApi,
} from "naive-ui";

import { computed, ref, watch, useAttrs, h, toRaw } from "vue";
import { formatValue, getValue } from "../utils";
import DInput from "./input.vue";

const { message, dialog } = createDiscreteApi(["message", "dialog"]);

const attrs = useAttrs();
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
    type: [Object, Number, String],
    default: () => {},
  },
  selectable: {
    type: Boolean,
  },
  pagination: {
    type: [Object, Boolean],
    required: false,
    default: () => undefined,
  },
  editable: {
    type: Boolean,
    required: false,
    default: false,
  },
  scrollX: {
    type: [Number, String, Boolean],
    required: false,
    default: false,
  },
  height: {
    type: [String, Number],
    default: "800px",
  },
  returnObject: { type: Boolean, required: false, default: false },
  selectedClass: {
    type: String,
    default: "selectedRow",
  },
  sortable: { type: Boolean, required: false, default: true },
  resizable: { type: Boolean, required: false, default: true },
  filterable: { type: Boolean, required: false, default: true },
});
const originTable = ref(null);
function resetFilters() {
  processColumns();
}
function scrollTo(value) {
  originTable.value.scrollTo(value);
}
function getData() {
  return originTable.value.mainTableInstRef.bodyInstRef.rawPaginatedData;
}
const cols = ref([]);

defineExpose({
  resetFilters,
  scrollTo,
  getData,
  cols,
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

const page = computed(() => {
  if (!props.pagination && props.pagination != false) {
    return {
      defaultPageSize: 15,
      showSizePicker: true,
      pageSizes: [10, 25, 50, items.value.length].sort((a, b) => a - b),
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

const selectedKey = ref(null);
const selectedItem = ref({});
const editedRow = ref(null);
const editedIndex = ref(null);
const emit = defineEmits([
  "update:modelValue",
  "update:expanded",
  "put",
  "delete",
]);
const rowProps = (rowData, rowIndex) => ({
  onClick: () => {
    if (props.selectable && rowData.selectable != false) {
      let key = null;
      if (attrs["row-key"]) {
        key = attrs["row-key"](rowData);
      } else {
        key = rowIndex;
      }
      selectedItem.value = selectedKey.value == key ? null : rowData;
      selectedKey.value = selectedKey.value == key ? null : key;
    }
  },
});
watch(selectedKey, (newValue) => {
  if (!props.returnObject) emit("update:modelValue", newValue);
});
watch(
  () => ({ ...selectedItem.value }),
  () => {
    if (props.returnObject) emit("update:modelValue", selectedItem.value);
  },
  { deep: true }
);
function getRowClass(rowData, index) {
  let classes = "";
  if (rowData.disabled) classes += " disabledRow ";
  if (
    attrs["row-key"] &&
    expandedKeys.value.indexOf(attrs["row-key"](rowData)) >= 0
  )
    classes += " font-weight-bold ";
  if (
    (!attrs["row-key"] && index == selectedKey.value) ||
    (attrs["row-key"] && attrs["row-key"](rowData) == selectedKey.value)
  ) {
    classes += " " + props.selectedClass + " ";
  }
  return classes;
}
const processColumns = () => {
  const columns = ref(props.columns.map((c) => ({ ...c })));
  columns.value.forEach((field) => {
    if (props.sortable && field.sortable != false) field.sorter = "default";
    if (field.type == "selection") field.sorter = undefined;
    if (field.resizable != false) field.resizable = props.resizable;
    if (!field.render)
      field.render = (row, index) => {
        if (
          props.editable &&
          (index == editedIndex.value || row.new) &&
          (!field.pk || row.new) &&
          !field.auto
        )
          return h(DInput, {
            modelValue: editedRow.value[field.key],
            ...field,
            disableLabel: true,

            "onUpdate:modelValue": (value) =>
              (editedRow.value[field.key] = value),
          });
        else if (field.type == "bool") {
          if (row[field.key] == true)
            return h(Icon, { color: "green", size: "18", name: "gg:check-o" });
          else if (row[field.key] == false)
            return h(Icon, {
              color: "red",
              size: "18",
              name: "ion:ban-outline",
            });
          else
            return h(Icon, {
              color: "orange",
              size: "18",
              name: "cil:warning",
            });
        }
        return formatValue(row, field);
      };
    if (!field.filter && props.filterable && field.filter != false) {
      if (field.type == "bool") {
        field.filterOptions = [
          { label: "Y", value: "true" },
          { label: "N", value: "false" },
        ];
        field.filter = (value, row) => {
          const valBool = value == "true";
          return getValue(row, field) == valBool;
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
        else if (temp.length > 0 && typeof temp[0] != "object")
          temp = temp.map((t) => ({
            label: t.charAt(0).toUpperCase() + t.slice(1),
            value: t,
          }));
        field.filterOptions = temp;
        field.filter = (value, row) => {
          return getValue(row, field) == value;
        };
      } else if (["date", "month", "year"].indexOf(field.type) >= 0) {
        field.filterOptionValue = null;
        field.renderFilterIcon = () => {
          return h(Icon, { name: "ph:calendar-duotone" });
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
                    if (field.onUpdateFilters)
                      field.onUpdateFilters(field.filterOptionValue);
                    hide();
                  },
                }),
                h(
                  NButton,
                  {
                    size: "tiny",
                    onClick: () => {
                      field.filterOptionValue = null;
                      if (field.onUpdateFilters)
                        field.onUpdateFilters(field.filterOptionValue);
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
        field.renderFilterIcon = () => {
          return h(Icon, { name: "ic:outline-expand" });
        };
        field.filter = (value, row) => {
          const v = getValue(row, field);
          return (
            !field.filterOptionValue ||
            (!field.filterOptionValue[0] | (v >= field.filterOptionValue[0]) &&
              !field.filterOptionValue[1] | (v <= field.filterOptionValue[1]))
          );
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
                    if (
                      !field.filterOptionValue[0] &&
                      field.filterOptionValue[1]
                    )
                      field.filterOptionValue = null;
                    if (field.onUpdateFilters)
                      field.onUpdateFilters(field.filterOptionValue);
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
                    if (
                      !field.filterOptionValue[0] &&
                      field.filterOptionValue[1]
                    )
                      field.filterOptionValue = null;
                    if (field.onUpdateFilters)
                      field.onUpdateFilters(field.filterOptionValue);
                  },
                }),
                h(
                  NButton,
                  {
                    size: "tiny",
                    onClick: () => {
                      field.filterOptionValue = null;
                      if (field.onUpdateFilters)
                        field.onUpdateFilters(field.filterOptionValue);
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
        field.filterMutilple = true;
        field.renderFilterIcon = () => {
          return h(Icon, { name: "iconamoon:search" });
        };
        field.filterMode = "and";
        field.filter = (value, row) => {
          let v = getValue(row, field);
          if (v === undefined || v === null || v == "") v = "(blank)";
          const f = field.filterOptionValue;
          return (
            !f ||
            ((!f.search ||
              !field.filterOptions?.length > 0 ||
              v?.toLowerCase().includes(f.search.toLowerCase())) &&
              (!f.options.length > 0 || !f.options.includes(v)))
          );
        };
        let options = [
          ...new Set(items.value.map((o) => getValue(o, field))),
        ].sort();
        if (options.some((o) => o == undefined || o == null || o == ""))
          options.unshift("(blank)");
        options = options.filter((o) => o);
        const getOptions = (value) =>
          options.filter((o) => {
            let temp = o;
            if (temp === undefined || temp === null || temp == "")
              temp = "(blank)";
            return (
              !value ||
              !temp ||
              temp.toLowerCase().includes(value.toLowerCase())
            );
          });
        field.setFilter = (text) => {
          field.filterOptions = getOptions(text);
          field.filterOptionValue = {
            search: text,
            options: field.filterOptionValue?.options || [],
          };
          if (!text && !field.filterOptionValue?.options.length > 0)
            field.filterOptionValue = null;
        };
        field.filterOptions = getOptions(null);
        field.renderFilterMenu = ({ hide }) => {
          return h(
            NSpace,
            { style: { padding: "12px" }, vertical: true },
            {
              default: () => [
                h(NInput, {
                  placeholder: "",
                  autofocus: true,
                  value: field.filterOptionValue?.search,
                  onKeyup: (key) => {
                    if (key.code == "Enter" || key.code == "Escape") hide();
                  },
                  onInput: (text) => {
                    field.setFilter(text);
                    if (field.onUpdateFilters)
                      field.onUpdateFilters(field.filterOptionValue);
                  },
                }),
                h(
                  NVirtualList,
                  {
                    items: field.filterOptions,
                    style: { maxHeight: "200px", maxWidth: "200px" },
                    itemSize: 12,
                    itemResizable: true,
                  },
                  {
                    default: ({ item }) =>
                      h(NCheckbox, {
                        key: item,
                        label: item,
                        value: item,
                        style: { width: "100%" },
                        checked: !(
                          field.filterOptionValue &&
                          field.filterOptionValue.options.indexOf(item) >= 0
                        ),
                        onUpdateChecked: (value) => {
                          if (value) {
                            field.filterOptionValue.options.splice(
                              field.filterOptionValue.options.indexOf(item),
                              1
                            );
                            if (
                              !field.filterOptionValue?.search &&
                              !field.filterOptionValue?.options.length > 0
                            )
                              field.filterOptionValue = null;
                          } else {
                            if (!field.filterOptionValue)
                              field.filterOptionValue = {
                                search: null,
                                options: [],
                              };
                            field.filterOptionValue.options.push(item);
                          }
                          if (field.onUpdateFilters)
                            field.onUpdateFilters(field.filterOptionValue);
                        },
                      }),
                  }
                ),
                h(
                  NButton,
                  {
                    size: "tiny",
                    onClick: () => {
                      field.filterOptionValue = null;
                      field.filterOptions = getOptions();
                      if (field.onUpdateFilters)
                        field.onUpdateFilters(field.filterOptionValue);
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
    }
  });
  if (props.editable) {
    const col = {
      key: "actions",
      filter: false,
      width: "140px",
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
              h(Icon, {
                name: "mingcute:add-fill",
                color: "green",
              }),
          }
        );
      },
      render: (row, index) => {
        return editedIndex.value == index || row.new
          ? h(
              NSpace,
              { wrap: false },
              {
                default: () => [
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
                            emit("put", editedRow.value);
                            editedIndex.value = null;
                            editedRow.value = -1;
                          },
                        });
                      },
                    },
                    {
                      icon: () =>
                        h(Icon, {
                          name: "mdi:success-bold",
                          color: "green",
                          size: "22",
                        }),
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
                      class: "mx-n2",
                    },
                    {
                      icon: () =>
                        h(Icon, {
                          name: "mdi:cancel-bold",
                          color: "orange",
                          size: "22",
                        }),
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
                        h(Icon, {
                          name: "ic:baseline-delete",
                          color: "red",
                          size: "22",
                        }),
                    }
                  ),
                ],
              }
            )
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
                  h(Icon, {
                    name: "material-symbols:edit-outline",
                    color: "blue",
                    size: "20",
                  }),
              }
            );
      },
    };
    if (columns.value.some((f) => f.key == "actions")) columns.value.splice(-1);
    columns.value.push(col);
  }
  cols.value = columns.value;
};
const mainTable = ref("");
processColumns();
watch(
  () => props.columns,
  () => processColumns()
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      selectedItem.value = null
      selectedKey.value = null
    }
  }
)

watch(
  () => props.data,
  (newValue) => {
    processColumns();
    if (selectedKey.value) {
      const newSelect = newValue.find((i, idx) =>
        attrs["row-key"]
          ? attrs["row-key"](i) == selectedKey.value
          : idx == selectedKey.value
      );
      if (newSelect) selectedItem.value = newSelect;
      else {
        selectedItem.value = null;
        selectedKey.value = null;
      }
    }

    if (newValue.length >= 0) {
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