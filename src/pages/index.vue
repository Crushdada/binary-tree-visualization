<script setup lang="ts">
import { generateTree, bfs } from "~/composables/logic";
import { ref, onMounted } from "vue";
import { isDark } from "~/composables";
import { isArray, isObject } from "~/utils/get-type";
import { debounce } from "lodash";

const canvasContainer = ref(null); // canvas容器
const canvas = document.createElement("canvas"); // canvas画布
const size = 30; // 用于计算二叉树初始渲染尺寸
const BFSArrayText = ref(""); // 层序遍历数组
const JSONTreeText = ref(""); // JSON树
const debounceBuildTree1 = debounce(trigger1, 1500);
const debounceBuildTree2 = debounce(trigger2, 1500);

watch(BFSArrayText, debounceBuildTree1)
watch(JSONTreeText, debounceBuildTree2)

function trigger1(val: string) {
  try {
    const arr = JSON.parse(val);
    if (!isArray(arr)) return;
    const JSONTree = generateTree(arr);
    JSONTreeText.value = JSON.stringify(JSONTree, null, 4);
    PrettyBT.drawBinaryTree(canvas, JSONTree, size);
  } catch (err) {}
}
function trigger2(val: string) {
  try {
    const tree = JSON.parse(val);
    if (!isObject(tree)) return;
    const bfsArray = bfs(tree);
    BFSArrayText.value = JSON.stringify(bfsArray);
    PrettyBT.drawBinaryTree(canvas, tree, size);
  } catch (err) {}
}
onMounted(() => {
  canvasContainer.value.appendChild(canvas);
  trigger1(`["tree",2,3,null,5,6,7]`);
});

function darkModeShim() {
  return "text-gray-5";
}
</script>

<template>
  Please make sure that Count (TreeNodes) > 1 , and you can also enter a tree in
  JSON format :)
  <div flex="~ gap-2">
    <!-- Left user input area -->
    <div flex-col>
      <h1 text-6 py-4>BFS Array</h1>
      <textarea
        rows="5"
        cols="40"
        border="1 gray-500/40"
        b-rd-2
        shadow
        v-model="BFSArrayText"
        :class="isDark && darkModeShim()"
      ></textarea>

      <h1 text-6 py-4>Binary tree in JSON</h1>
      <textarea
        rows="15"
        cols="40"
        border="1 gray-500/40"
        v-model="JSONTreeText"
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
