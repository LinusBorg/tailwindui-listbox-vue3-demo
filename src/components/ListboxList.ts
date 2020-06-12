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
} from "vue";
import { ListBoxKey } from "./Listbox";
import { ListboxListAPI, Option } from "../types";
import { isString } from "../utils/isString";

function useKeyBoardInput(api: ListboxListAPI) {
  return function (event: KeyboardEvent) {
    let indexToFocus: number;
    const focusedIndex = api.activeOptionIndex;
    const values = api.options;
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
          focusedIndex - 1 < 0 ? values.length - 1 : focusedIndex - 1;
        api.activate(values[indexToFocus].id);
        break;
      case "Down":
      case "ArrowDown":
        event.preventDefault();
        indexToFocus =
          focusedIndex + 1 > values.length - 1 ? 0 : focusedIndex + 1;
        api.activate(values[indexToFocus].id);
        break;
      case "Spacebar":
      case " ":
        event.preventDefault();
        if (api.typeahead !== "") {
          api.type(" ");
        } else {
          api.select(
            api.activeOption // || this.context.props.value
          );
        }
        break;
      case "Enter":
        event.preventDefault();
        api.select(
          api.activeOption // || this.context.props.value
        );
        break;
      default:
        if (!(isString(event.key) && event.key.length === 1)) {
          return;
        }

        event.preventDefault();
        api.type(event.key);
        return;
    }
  };
}

export const ListboxListKey = Symbol("ListboxList") as InjectionKey<
  ListboxListAPI
>;
export const ListboxList = defineComponent({
  name: "ListboxList",
  setup(props, { slots }) {
    const lbApi = inject(ListBoxKey);

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
    watch(
      () => lbApi.selectedOption,
      () => (typeahead.value = "")
    );

    const api: ListboxListAPI = readonly({
      ...lbApi,
      // Listbox Options
      addOption,
      removeOption,

      // Focus State
      activeOption,
      activeOptionIndex,
      options,
      activate,

      // Typeahead
      typeahead,
      type,
    });

    const onKeydown = useKeyBoardInput(api);

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
