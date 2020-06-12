import {
  defineComponent,
  h,
  ref,
  readonly,
  reactive,
  onUnmounted,
  computed,
  InjectionKey,
  watch,
  provide,
  nextTick,
} from "vue";
import { uuid } from "../utils/uuid";
import { ListboxAPI, Option } from "../types";

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
      let option;
      if (
        (option = options.find((option) => option.value === props.modelValue))
      ) {
        emit("update:modelValue", value);
        typeahead.value = "";
        activate(option.id);
      }
    };

    // Other Ids
    const labelId = uuid();

    // Option Values and their element's ids
    const options = reactive<Option[]>([]);
    const removeOption = (id: string, value: any) => {
      const idx = options.findIndex((option) => id === option.id);
      idx !== -1 && options.splice(idx, 1);
    };
    const addOption = (id: string, value: any) => {
      options.push({ id, value });
      // when child component that called this function unmounts,
      // the option will be removed.
      onUnmounted(() => removeOption(id, value));
    };

    // Active State (Focus Tracking, essentially)
    const activeOption = ref<any>();
    const activeOptionIndex = computed(() =>
      options.findIndex((option) => option.id === activeOption.value)
    );
    const activate = (id: any) => {
      if (options.find((option) => option.id === id)) {
        activeOption.value = id;
        nextTick(() => {
          document.querySelector(id)?.scrollIntoView({
            block: "nearest",
          });
        });
      }
    };

    // Typeahead
    const typeahead = ref("");
    const type = (char: string) => (typeahead.value = typeahead.value + char);
    const optionElements = computed(
      () =>
        Array.from(
          document.querySelectorAll(options.map((_) => "#" + _.id).join(","))
        ) as HTMLElement[]
    );
    watch(typeahead, (val) => {
      if (val === "") return;
      if (val.length > 1) {
        const match = optionElements.value.find((el) =>
          el.innerText.toLowerCase().startsWith(typeahead.value)
        );
        match?.click();
      }
    });

    const api: ListboxAPI = readonly({
      // Opening State
      isOpen,
      open,
      toggle,
      close,
      // Selected State,
      selectedOption,
      select,

      // Listbox Options
      addOption,
      removeOption,

      // Focus State
      activeOption,
      activeOptionIndex,
      options,
      activate,
      
      // Ids
      labelId,
      
      // Typeahead
      typeahead,
      type,
    });
    provide(ListBoxKey, api);
    return () => h(props.tag, slots.default?.(api));
  },
});
