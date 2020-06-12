import { defineComponent, h, inject, ref, watchEffect } from "vue";
import { ListBoxKey } from "./Listbox";
import { uuid } from "../utils/uuid";

export const ListboxButton = defineComponent({
  name: "ListboxButton",
  setup(_, { slots }) {
    const api = inject(ListBoxKey);
    const id = uuid();
    const button = ref<HTMLElement | undefined>();
    const isFocused = ref<boolean>(false);
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
          onFocus: () => (isFocused.value = true),
          onBlur: () => (isFocused.value = false),
        },
        slots.default({ isFocused })
      );
  },
});
