import {
  defineComponent,
  h,
  inject,
  InjectionKey,
  watch,
  computed,
  ref,
  nextTick,
  onUnmounted,
  reactive,
  readonly,
  provide,
  onMounted,
} from "vue";
import { ListBoxKey } from "./Listbox";
import { ListboxListAPI, Option } from "../types";
import { isString } from "../utils/isString";

export const ListboxListKey = Symbol("ListboxList") as InjectionKey<
  ListboxListAPI
>;
export const ListboxList = defineComponent({
  name: "ListboxList",
  setup(props, { slots }) {
    const listboxApi = inject(ListBoxKey);

    // Option Values and their element's ids
    const options = reactive<Option[]>([]);
    const removeOption = (id: string) => {
      const idx = options.findIndex((option) => id === option.id);
      idx !== -1 && options.splice(idx, 1);
    };
    const addOption = (id: string, value: any) => {
      options.push({ id, value });
      // when child component that called this function unmounts,
      // the option will be removed.
      onUnmounted(() => removeOption(id));
    };

    // Active State (Focus Tracking, essentially)
    const activeOption = ref<Option>();
    onMounted(() => {
      const option = options.find((o) => o.value === listboxApi.selectedOption);
      if (option) {
        activeOption.value = option;
      } else {
        activeOption.value = options[0];
      }
    });
    const activeOptionIndex = computed(() => {
      return options.findIndex((option) => option === activeOption.value);
    });
    const activate = (_option: Option | string) => {
      let option: Option;
      if (typeof _option === "string") {
        option = options.find((o) => o.id === _option);
      } else {
        option = _option;
      }
      activeOption.value = option;
      nextTick(() => {
        document.querySelector(option.id)?.scrollIntoView({
          block: "nearest",
        });
      });
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
        activate(options.find((option) => option.id === match.id));
      }
    });
    watch(
      [() => listboxApi.selectedOption, () => listboxApi.isOpen],
      () => (typeahead.value = "")
    );

    const api: ListboxListAPI = readonly({
      ...listboxApi,
      // Listbox Options
      addOption,
      removeOption,
      // Focus State
      activeOption,
      activate,
    });

    const onKeydown = function (event: KeyboardEvent) {
      let indexToFocus: number;
      const focusedIndex = activeOptionIndex.value;
      switch (event.key) {
        case "Esc":
        case "Escape":
          event.preventDefault();
          api.close();
          break;
        case "Tab": // TODO: is this a good idea, in terms of A11y?
          event.preventDefault();
          break;
        case "Up":
        case "ArrowUp":
          event.preventDefault();
          indexToFocus =
            focusedIndex - 1 < 0 ? options.length - 1 : focusedIndex - 1;
          api.activate(options[indexToFocus]);
          break;
        case "Down":
        case "ArrowDown":
          event.preventDefault();
          indexToFocus =
            focusedIndex + 1 > options.length - 1 ? 0 : focusedIndex + 1;
          api.activate(options[indexToFocus]);
          break;
        case "Spacebar":
        case " ":
          event.preventDefault();
          if (typeahead.value !== "") {
            type(" ");
          } else {
            api.select(
              activeOption.value.value // || this.context.props.value
            );
          }
          break;
        case "Enter":
          event.preventDefault();
          api.select(
            activeOption.value.value // || this.context.props.value
          );
          break;
        default:
          if (!(isString(event.key) && event.key.length === 1)) {
            return;
          }

          event.preventDefault();
          type(event.key);
          return;
      }
    };

    provide(ListboxListKey, api);
    return () =>
      h(
        "UL",
        {
          role: "listbox",
          tabindex: "-1",
          "aria-activedescendant": api.activeOption,
          // using vnode lifecycle to focus element on mount
          // because that's equivalent with "when the listby has been opened"
          onVnodeMounted: ({ el }) => el?.focus(),
          onKeydown,
        },
        slots.default()
      );
  },
});
