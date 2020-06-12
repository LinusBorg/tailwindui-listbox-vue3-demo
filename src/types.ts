import { Ref, ComputedRef } from "vue";

export interface ListboxAPI<State = any> {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;

  selectedOption: State;
  select: (value: State) => void;

  labelId: string;
}

export interface ListboxListAPI extends ListboxAPI {
  options: Option[];
  activeOption: string;
  activeOptionIndex: number;

  addOption: (id: string, value: any) => void;
  removeOption: (id: string, value: any) => void;
  activate: (value: string) => void;

  typeahead: string;
  type: (char: string) => string;
}

export interface Option<State = any> {
  id: string;
  value: State;
}
