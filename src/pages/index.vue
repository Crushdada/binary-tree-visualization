<script setup lang="ts">
import { isObject } from "@vueuse/core";
import { generateTree } from "~/composables/logic";
import { Ref, ref, onMounted } from "vue";
import { isDark } from "~/composables";
import { isArray } from "~/utils/get-type";
import { debounce } from "lodash";
const canvasContainer = ref(null) as Ref; // canvas容器
const canvas = document.createElement("canvas"); // canvas画布
const size = 30; // 用于计算二叉树初始渲染尺寸
const BFSArray = ref(""); // 层序遍历数组
const JSONTree = ref(""); // Json树

/**
 * 如果层序遍历的数组合法，生成对应JSON以及树
 **/
const handleUpdateJSON = debounce((v: string) => {
  const arr = BFSArrayValidated(v);
  if (!arr) return;
  const tree = generateTree(arr);
  JSONTree.value = JSON.stringify(tree, null, 4);
  PrettyBT.drawBinaryTree(canvas, tree, size);
}, 700);

watch(BFSArray, handleUpdateJSON);
/**
 * 校验BFS Array的格式
 **/
function BFSArrayValidated(val: string) {
  const arr = JSON.parse(val);
  return isArray(arr) ? arr : false;
}
onMounted(() => {
  var tree = { val: 1, left: { val: 2 }, right: { val: 3 } };
  // or: var tree = PrettyBT.treeFromString("[a,b,c,,d]");
  canvasContainer.value.appendChild(canvas);
  PrettyBT.drawBinaryTree(canvas, tree, size);
});
function darkModeShim() {
  return "text-gray-5";
}
// 持久化树
// useStorage("vue-sweeper-state", play.state);
</script>

<template>
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
        v-model="BFSArray"
        :class="isDark && darkModeShim()"
      ></textarea>

      <h1 text-6 py-4>Binary tree in JSON</h1>
      <textarea
        rows="15"
        cols="40"
        border="1 gray-500/40"
        v-model="JSONTree"
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
