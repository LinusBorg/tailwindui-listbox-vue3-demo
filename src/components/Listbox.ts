import {
  defineComponent,
  h,
  ref,
  readonly,
  computed,
  InjectionKey,
  provide,
} from "vue";

import { uuid } from "../utils/uuid";
import { ListboxAPI } from "../types";

export const ListBoxKey = Symbol("ListboxKey") as InjectionKey<ListboxAPI>;

export const Listbox = defineComponent({
  name: "Listbox",
  props: {
    tag: {
      type: String,
      default: "DIV",
    },
    modelValue: {
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { slots, emit }) {
    // Opening State of Listbox
    const isOpen = ref(false);
    const open = () => (isOpen.value = true);
    const close = () => (isOpen.value = false);
    const toggle = () => (isOpen.value ? close() : open());

    // Selected State
    const selectedOption = computed(() => props.modelValue);
    const select = (value: any) => {
      emit("update:modelValue", value);
      close();
    };

    // Other Ids
    const labelId = uuid();

    const api: ListboxAPI = readonly({
      // Opening State
      isOpen,
      open,
      toggle,
      close,
      // Selected State,
      selectedOption,
      select,
      // Ids
      labelId,
    });

    provide(ListBoxKey, api);
    return () => h(props.tag, slots.default?.(api));
  },
});
