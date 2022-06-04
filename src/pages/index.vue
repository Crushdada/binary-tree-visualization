<script setup lang="ts">
import { isObject } from "@vueuse/core";
import { generateTree } from "~/composables/logic";
import { ref, onMounted } from "vue";
import { isDark } from "~/composables";
import { isArray } from "~/utils/get-type";
const canvasContainer = $(ref()); // canvas容器
const canvas = document.createElement("canvas"); // canvas画布
const size = 30; // 用于计算二叉树初始渲染尺寸
const BFSArrayText = $(ref("[1,2,3,4,null,6,7]")); // 层序遍历数组

// 从第一个textArea解析出的BFS Array
const BFSArray = computed({
  get: () => {
    const arr = BFSArrayValidated(BFSArrayText);
    if (!arr) return BFSArrayText;
    return arr;
  },
  set: (val) => {
    BFSArray.value = val;
  },
});
// Json树
const JSONTree = computed(() => generateTree(BFSArray.value));

// 第二个textArea显示的JSON文本
const JSONTreeText = computed({
  get: () => {
    let structuredJson = "";
    try {
      structuredJson = JSON.stringify(JSONTree.value, null, 4);
      return structuredJson;
    } catch (err) {}
  },
  set: (val) => {
    JSONTreeText.value = val;
  },
});

watch(
  JSONTree,
  () => {
    PrettyBT.drawBinaryTree(canvas, JSONTree.value, size);
  },
  {
    deep: true,
  }
);

/**
 * 校验BFS Array的格式
 **/
function BFSArrayValidated(val: string) {
  let arr = null;
  try {
    arr = JSON.parse(val);
    return isArray(arr) ? arr : false;
  } catch (err) {}
}

onMounted(() => {
  canvasContainer.appendChild(canvas);
  PrettyBT.drawBinaryTree(canvas, JSONTree.value, size);
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
