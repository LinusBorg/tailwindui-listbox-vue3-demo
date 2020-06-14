<template>
  <div>
    <select name="" id="">
      <option>Foo</option>
      <option>Bar</option>
      <option>Baz</option>
    </select>
    <Listbox
      v-model="selectedWrestler"
      v-slot="{
        isOpen
      }"
    >
      <ListboxLabel class="sr-only">
        Select a wrestler:
      </ListboxLabel>
      <ListboxButton class="rounded p-3 border">
        {{ selectedWrestler }}
      </ListboxButton>
      <ListboxList v-if="isOpen">
        <ListboxOption
          v-for="wrestler in wrestlers"
          :key="wrestler"
          :value="wrestler"
          v-slot="{ isActive, isSelected }"
        >
          <li
            class="p-3"
            :class="
              isActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'
            "
          >
            {{ wrestler }}
            <img v-if="isSelected" src="/checkmark.svg" />
          </li>
        </ListboxOption>
      </ListboxList>
    </Listbox>
  </div>
</template>

<script>
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxList,
  ListboxOption
} from "./components";

export default {
  components: {
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxList,
    ListboxOption
  },
  data() {
    return {
      selectedWrestler: "The Ultimate Warrior",
      wrestlers: [
        "The Ultimate Warrior",
        "Randy Savage",
        "Hulk Hogan",
        "Bret Hart",
        "The Undertaker",
        "Mr. Perfect",
        "Ted DiBiase",
        "Bam Bam Bigelow",
        "Yokozuna"
      ]
    };
  }
};
</script>