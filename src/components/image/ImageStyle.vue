<template>
  <div class="container">
    <ul class="prop-list">
      <li>
        x：
        <a-input-number v-model:value="image.attribute.x" />
      </li>
      <li>
        y：
        <a-input-number v-model:value="image.attribute.y" />
      </li>
      <li>
        宽：
        <a-input-number v-model:value="image.attribute.width" />
      </li>
      <li>
        高：
        <a-input-number v-model:value="image.attribute.height" />
      </li>
      <li>
        旋转角度：
        <a-input-number v-model:value="image.rotateAngle" :min="0" :max="360" />
      </li>
      <li>
        开启预览：
        <a-switch v-model:checked="image.preview"/>
      </li>
    </ul>
  </div>
</template>
<script setup>
import {
  defineComponent,
  ref,
  computed,
  watch,
  reactive,
  defineProps,
} from "vue";
import "vue3-colorpicker/style.css";
import { ColorPicker } from "vue3-colorpicker";
import { nanoid } from "nanoid";

const props = defineProps(["ele"]);

// eslint-disable-next-line vue/no-setup-props-destructure
const image = props.ele;

</script>

<style scoped lang="less">
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
