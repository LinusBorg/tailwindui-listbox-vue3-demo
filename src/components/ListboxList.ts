import { defineComponent, h, inject } from "vue";
import { ListBoxKey } from "./Listbox";
import { ListboxAPI } from "../types";
import { isString } from "../utils/isString";

function useKeyBoardInput(api: ListboxAPI) {
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

export const ListboxList = defineComponent({
  name: "ListboxList",
  setup(props, { slots }) {
    const api = inject(ListBoxKey);
    const onKeydown = useKeyBoardInput(api);
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
