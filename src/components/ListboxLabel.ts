import { defineComponent, inject, h } from "vue";
import { ListBoxKey } from "./Listbox";

export const ListboxLabel = defineComponent({
  name: "ListboxLabel",
  setup(props, { slots }) {
    const { labelId } = inject(ListBoxKey);
    return () => h("SPAN", { id: labelId }, slots.default());
  },
});
