<template>
  <div class="container">
    <ul class="prop-list">
      <li>
        宽：
        <a-input-number v-model:value="svg.attribute.width" />
      </li>
      <li>
        高：
        <a-input-number v-model:value="svg.attribute.height" />
      </li>
      <li>
        背景颜色：
        <color-picker
          v-model:pureColor="svg.attribute.style['background-color']"
          format="rgb"
          shape="square"
          useType="pure"
        />
      </li>
      <li>
        是否开启评论：
        <a-switch v-model:checked="svg.comments_able" @change="setCommentAble"></a-switch>
      </li>
      <li>
        是否拥有画布：
        <a-switch v-model:checked="svg.board_able" @change="setBoardAble"></a-switch>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, defineComponent, defineProps, ref, watch } from "vue";
import "vue3-colorpicker/style.css";
import { ColorPicker } from "vue3-colorpicker";
import { SvgBoard } from "@/model/Shape";

const props = defineProps(["ele"]);
// eslint-disable-next-line vue/no-setup-props-destructure
const svg = props.ele;
const setup = ref(true);
svg.attribute.viewBox = computed(() => {
  if (setup.value) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    setup.value = false;
    return "0 0 " + svg.attribute.width + " " + svg.attribute.height;
  } else {
    return "0 0 " + svg.attribute.width + " " + svg.attribute.height;
  }
});
const setCommentAble=(value)=>{
  svg.SETCOMMENT()
}
// setCommentAble()
// const board_able=ref(!!svg.board_able)
const setBoardAble=(value)=>{
  // svg.board_able=board_able.value=value
  svg.SETBOARD()
}
// setBoardAble()
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  padding-left: 20px;

  .prop-list {
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
