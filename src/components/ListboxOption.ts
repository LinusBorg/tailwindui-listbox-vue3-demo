import {
  cloneVNode,
  defineComponent,
  h,
  inject,
  computed,
  ref,
  onMounted,
} from "vue";
import { uuid } from "../utils/uuid";
import { ListboxListKey } from "./ListboxList";

export const ListboxOption = defineComponent({
  name: "ListBoxOption",
  props: {
    tag: {
      type: String,
      default: "li",
    },
    value: {
      required: true,
    },
  },
  setup(props, { slots }) {
    const api = inject(ListboxListKey);

    const id = uuid();
    // TODO handle props value change?
    onMounted(() => api.addOption(id, props.value));

    const isSelected = computed(() => api.selectedOption === props.value);
    const select = () => {
      api.select(props.value);
    };

    const attributes = computed(() => ({
      id,
      role: "option",
      "aria-selected": isSelected.value,
      onClick: select,
      onMousemove: () => api.activate(id),
    }));

    return () =>
      cloneVNode(
        slots.default({
          isActive: api.activeOption?.value === props.value,
          isSelected: api.selectedOption === props.value,
        })[0],
        attributes.value
      );
    // h(
    //   props.tag,
    //   attributes,
    //   slots.default({
    //     isActive: api.activeOption?.value === props.value,
    //     isSelected: api.selectedOption === props.value,
    //   })
    // );
  },
});
