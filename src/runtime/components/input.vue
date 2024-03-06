<template>
  <div :style="style">
    <span v-if="!disableLabel">{{ f.label ? f.label : f.title }}</span>
    <n-select
      v-if="f.type == 'select'"
      v-bind="f"
      v-model:value="value"
      filterable
      clearable
      :loading="loading"
    />
    <n-input-number
      v-else-if="['number'].indexOf(f.type) >= 0"
      v-bind="f"
      v-model:value="value"
      clearable
    >
      <template
        v-if="f.prefix2"
        #prefix
      >
        {{ f.prefix2 }}
      </template>
      <template
        v-if="f.suffix"
        #suffix
      >
        {{ f.suffix }}
      </template>
    </n-input-number>

    <n-checkbox
      v-else-if="f.type == 'check'"
      v-bind="f"
      v-model:value="value"
    />
    <n-date-picker
      v-else-if="['date', 'month', 'daterange', 'year'].indexOf(f.type) >= 0"
      v-model:formatted-value="value"
      value-format="yyyy-MM-dd"
      :format="'dd/MM/yyyy'"
      v-bind="f"
    />
    <n-spin
      v-else-if="f.type == 'cascader'"
      size="10"
      :show="loading"
    >
      <n-cascader
        v-model:value="value"
        multiple
        clearable
        :options="f.options"
        :max-tag-count="2"
        check-strategy="parent"
        filterable
        :clear-filter-after-select="true"
        v-bind="f"
      />
    </n-spin>
    <n-switch
      v-else-if="f.type == 'bool'"
      v-model:value="value"
      v-bind="f"
    />
    <n-input
      v-else
      v-model:value="value"
      clearable
      v-bind="f"
    >
      <template
        v-if="f.prefix2"
        #prefix
      >
        {{ f.prefix2 }}
      </template>
      <template
        v-if="f.suffix"
        #suffix
      >
        {{ f.suffix }}
      </template>
    </n-input>
  </div>
</template>
<script setup>
import { computed, useAttrs, ref, watch, defineOptions } from "vue";

defineOptions({
  name: "DInput",
});
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array, Object, null],
    default: null,
    required: false,
  },
  style: { required: false, type: [Object, String], default: "" },
  disableLabel: { required: false, type: Boolean, default: false },
  asyncProps: { required: false, type: [Function, Boolean], default: false },
});
const attrs = useAttrs();
const value = ref(
  props.modelValue ? props.modelValue : attrs.default ? attrs.default : null
);

const asyncPropsValue = ref({});
const loading = ref(false);
if (props.asyncProps) {
  loading.value = true;
  props.asyncProps().then((a) => {
    asyncPropsValue.value = a;
    loading.value = false;
  });
}
const f = computed(() => {
  const field = { placeholder: "", ...attrs, ...asyncPropsValue.value };
  if (field.type == "select") {
    if (
      field.options &&
      field.options.length > 0 &&
      typeof field.options[0] != "object"
    )
      field.options = field.options.map((o) => ({ label: o, value: o }));
  }
  field.prefix2 = field.prefix;
  delete field.prefix;
  field.suffix2 = field.suffix;
  delete field.suffix;

  return field;
});

const emit = defineEmits(["update:modelValue"]);
watch(
  () => props.modelValue,
  (newValue) => {
    value.value = newValue;
  }
);
watch(
  () => value,
  (newValue) => {
    emit("update:modelValue", newValue.value);
  },
  { deep: true }
);
</script>
<style>
.n-cascader-menu {
  --n-column-width: 350px !important;
}
</style>