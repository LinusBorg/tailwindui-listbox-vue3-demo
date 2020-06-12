import { Ref, ComputedRef } from "vue";

export interface ListboxAPI<State = any> {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;

  addOption: (id: string, value: any) => void;
  removeOption: (id: string, value: any) => void;
  selectedOption: State;
  select: (value: State) => void;
  activeOption: State;
  activeOptionIndex: number;
  options: Option[];
  activate: (value: State) => void;
  labelId: string;
  typeahead: string;
  type: (char: string) => string;
}

export interface Option<State = any> {
  id: string;
  value: State;
}
