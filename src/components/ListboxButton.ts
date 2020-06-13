import {
  defineComponent,
  h,
  inject,
  ref,
  watchEffect,
  watch,
  Ref,
  readonly,
} from "vue";
import { ListBoxKey } from "./Listbox";
import { uuid } from "../utils/uuid";

function useTrackFocus(element: Ref<HTMLElement | undefined>) {
  const isFocused = ref(false);
  const handleFocus = () => (isFocused.value = true);
  const handleBlur = () => (isFocused.value = false);
  watch(element, (el, _, onCleanup) => {
    el?.addEventListener("focus", handleFocus);
    el?.addEventListener("blur", handleBlur);
    onCleanup(() => {
      el?.removeEventListener("focus", handleFocus);
      el?.removeEventListener("blur", handleBlur);
    });
  });

  return readonly(isFocused);
}

export const ListboxButton = defineComponent({
  name: "ListboxButton",
  setup(_, { slots }) {
    const api = inject(ListBoxKey);
    const id = uuid();
    const button = ref<HTMLElement | undefined>();
    const isFocused = useTrackFocus(button);

    watchEffect(() => {
      if (!api.isOpen) {
        button.value?.focus();
      }
    });
    return () =>
      h(
        "BUTTON",
        {
          ref: button,
          id,
          "aria-expanded": api.isOpen,
          "aria-labelledby": api.labelId,
          onClick: () => api.toggle(),
        },
        slots.default({ isFocused: isFocused.value })
      );
  },
});
