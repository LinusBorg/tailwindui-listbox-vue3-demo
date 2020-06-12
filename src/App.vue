<template>
  <Listbox
    v-model="selectedWrestler"
    v-slot="{
      /* isOpen */
    }"
  >
    <ListboxLabel class="sr-only">
      Select a wrestler:
    </ListboxLabel>
    <ListboxButton class="rounded p-3 border">
      {{ selectedWrestler }}
    </ListboxButton>
    <!-- <ListboxList v-show="isOpen">
      <ListboxOption
        v-for="wrestler in wrestlers"
        :key="wrestler"
        :value="wrestler"
        v-slot="{ isActive, isSelected }"
      >
        <div
          class="p-3"
          :class="
            isActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'
          "
        >
          {{ wrestler }}
          <img v-show="isSelected" src="/checkmark.svg" />
        </div>
      </ListboxOption>
    </ListboxList> -->
  </Listbox>
</template>

<script>
import { Listbox, ListboxLabel, ListboxButton } from "./components";

export default {
  components: {
    Listbox,
    ListboxLabel,
    ListboxButton
    // ListboxList,
    // ListboxOption,
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