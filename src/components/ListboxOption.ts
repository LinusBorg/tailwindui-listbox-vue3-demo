import { defineComponent, h, inject, computed, ref, onMounted } from "vue";
import { uuid } from "../utils/uuid";
import { ListboxListKey } from "./ListboxList";

export default defineComponent({
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
    const element = ref<HTMLElement | undefined>();
    const api = inject(ListboxListKey);

    const id = uuid();
    // TODO handle props value change?
    onMounted(() => api.addOption(id, props.value));

    const isSelected = computed(() => api.selectedOption === props.value);
    const select = () => {
      api.select(props.value);
    };

    return () =>
      h(
        props.tag,
        {
          ref: element,
          id,
          role: "option",
          "aria-selected": isSelected.value,
          onClick: select,
          onMousemove: () => api.activate(id),
        },
        slots.default({
          isActive: api.activeOption === props.value,
          isSelected: api.selectedOption === props.value,
        })
      );
  },
});
