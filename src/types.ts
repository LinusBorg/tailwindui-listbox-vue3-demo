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
  activeOption: Option;
  addOption: (id: string, value: any) => void;
  removeOption: (id: string, value: any) => void;
  activate: (value: Option | string) => void;
}

export interface Option<State = any> {
  id: string;
  value: State;
}
