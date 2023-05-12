<template>
  <div class="container">
    <ul class="prop-list">
      <li>
        x：
        <a-input-number v-model:value="video.attribute.x" />
      </li>
      <li>
        y：
        <a-input-number v-model:value="video.attribute.y" />
      </li>
      <li>
        宽：
        <a-input-number v-model:value="video.attribute.width">
          <template #addonAfter>px</template>
        </a-input-number>
      </li>
      <li>
        高：
        <a-input-number v-model:value="video.attribute.height">
          <template #addonAfter>px</template>
        </a-input-number>
      </li>
      <li>
        背景填充：
        <color-picker
                v-model:pureColor="video.bgStyle['background-color']"
                format="rgb"
                shape="square"
                useType="pure"
        />
      </li>
      <li >
        边框样式：
        <a-select
                v-model:value="video.bgStyle['border-style']"
        >
          <a-select-option value="none">无边框</a-select-option>
          <a-select-option value="solid">实线边框</a-select-option>
          <a-select-option value="dashed">虚线边框</a-select-option>
          <a-select-option value="dotted">点线边框</a-select-option>
        </a-select>
      </li>
      <li>
        边框颜色：
        <color-picker
                v-model:pureColor="video.bgStyle['border-color']"
                format="rgb"
                shape="square"
                useType="pure"
        />
      </li>
      <li >
        边框宽度：
        <a-input-number v-model:value="borderWidth">
          <template #addonAfter>px</template>
        </a-input-number>
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
const video = props.ele;

const borderWidth=ref(parseInt(video.bgStyle['border-width']));
video.bgStyle['border-width']=computed(()=>{
  return borderWidth.value?`${borderWidth.value}px`:''
});
  
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
