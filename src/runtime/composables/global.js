import { computed } from "vue"
import { createDiscreteApi, lightTheme } from "naive-ui"

const configProviderPropsRef = computed(() => ({
  theme: lightTheme,
}))

const { message, notification, dialog, loadingBar } = createDiscreteApi(
  ["message", "dialog", "notification", "loadingBar"],
  {
    configProviderProps: configProviderPropsRef,
  }
)

export { message, notification, dialog, loadingBar }
