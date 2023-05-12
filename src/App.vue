<template>
  <main-vue />
</template>

<script setup>
import MainVue from "./components/MainVue.vue";
</script>

<style lang="less">
::-webkit-scrollbar {
  width: 6px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: inherit;
  background-color: rgba(144, 147, 153, 0.3);
  -webkit-transition: 0.3s background-color;
  transition: 0.3s background-color;
}
</style>
