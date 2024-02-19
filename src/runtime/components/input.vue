<template>
  <div>
    {{ field.label || field.title }}
    <n-select
      v-if="f.type == 'select'"
      v-bind="f"
      v-model:value="value"
    />
    <n-input-number
      v-else-if="['number'].indexOf(f.type) >= 0"
      v-bind="f"
      v-model:value="value"
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
    <n-cascader
      v-else-if="f.type == 'cascader'"
      v-model:value="value"
      v-bind="f"
      multiple
      placeholder="Meaningless values"
      clearable
      :options="f.options"
      :max-tag-count="2"
      expand-trigger="hover"
      check-strategy="parent"
      :cascade="true"
      :show-path="true"
      :filterable="true"
      :clear-filter-after-select="true"
    />
    <n-switch
      v-else-if="f.type == 'bool'"
      v-bind="f"
      v-model:value="value"
    />
    <n-input
      v-else
      v-bind="f"
      v-model:value="value"
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
defineOptions({
  name: "DInput",
});
const props = defineProps({
  field: { required: true, type:Object },
  modelValue: {
    type:null,
    required: true,
  },
});
const value = ref(
  props.modelValue
    ? props.modelValue
    : props.field.default
    ? props.field.default
    : null
);

const f = computed(() => {
  const field = { ...props.field };
  if (field.type == "select") {
    if (
      field.options &&
      field.options.length > 0 &&
      !typeof field.options[0] != "object"
    )
      field.options = field.options.map((o) => ({ label: o, value: o }));
  }
  if (field.prefix) {
    field.prefix2 = field.prefix;
    delete field.prefix;
  }
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