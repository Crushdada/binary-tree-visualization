<script setup lang="ts">
import { Ref, ref, onMounted } from "vue";
import { isDark } from "~/composables";

const canvasContainer = ref(null) as Ref;
onMounted(() => {
  var tree = { val: 1, left: { val: 2 }, right: { val: 3 } };
  // or: var tree = PrettyBT.treeFromString("[a,b,c,,d]");
  const canvas = document.createElement("canvas");
  canvasContainer.value.appendChild(canvas);
  const size = 30;
  PrettyBT.drawBinaryTree(canvas, tree, size);
});
function darkModeShim() {
  return "text-gray-5";
}
// 持久化树
// useStorage("vue-sweeper-state", play.state);
</script>

<template>
  <div flex="~ gap-2" pt-10>
    <!-- Left user input area -->
    <div flex-col>
      <h1 text-6>Input BT Array</h1>
      <textarea
        rows="5"
        cols="40"
        border="1 gray-500/40"
        b-rd-2
        shadow
        :class="isDark && darkModeShim()"
      ></textarea>
      <br />
      <h1 text-6>Input BT JSON</h1>
      <textarea
        rows="17"
        cols="40"
        border="1 gray-500/40"
        b-rd-2
        shadow
        :class="isDark && darkModeShim()"
      ></textarea>
    </div>
    <!-- Generated BTree -->
    <div flex flex-col flex-1 justify-center items-center pt-2>
      <h1 text-6>Binary Tree</h1>
      <div ref="canvasContainer"></div>
    </div>
  </div>
</template>
