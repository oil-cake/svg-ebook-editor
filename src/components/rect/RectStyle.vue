<template>
  <div class="container">
    <ul class="prop-list">
      <li>
        x：
        <a-input-number v-model:value="rect.attribute.x" />
      </li>
      <li>
        y：
        <a-input-number v-model:value="rect.attribute.y" />
      </li>
      <li>
        宽：
        <a-input-number v-model:value="rect.attribute.width" />
      </li>
      <li>
        高：
        <a-input-number v-model:value="rect.attribute.height" />
      </li>
      <li>
        填充：
        <color-picker
          v-if="rect.attribute.fill != 'none'"
          v-model:pureColor="rect.attribute.fill"
          format="rgb"
          shape="square"
          useType="pure"
        />
        <a-select v-model:value="rect.attribute.fill" style="max-width: 120px">
          <a-select-option value="none">无填充</a-select-option>
          <a-select-option value="red">颜色填充</a-select-option>
        </a-select>
      </li>
      <li>
        笔画颜色：
        <color-picker
          v-model:pureColor="rect.attribute.stroke"
          format="rgb"
          shape="square"
          useType="pure"
        />
      </li>
      <li>
        笔画粗细：
        <a-input-number
          v-model:value="rect.attribute['stroke-width']"
          :min="0"
        />
      </li>
      <li>
        笔画虚线：
        <a-input
          v-model:value="strokeDashoffset"
          placeholder="格式为半角逗号分隔的正整数字符串"
          auto-size
        />
      </li>
      <li>
        x圆角：
        <a-input-number v-model:value="rect.attribute.rx" :min="0" />
      </li>
      <li>
        y圆角：
        <a-input-number v-model:value="rect.attribute.ry" :min="0" />
      </li>
      <li>
        旋转角度：
        <a-input-number v-model:value="rect.rotateAngle" :min="0" :max="360" />
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
const rect = props.ele;
const strokeDashoffset = ref(
  rect.attribute["stroke-dasharray"] ? rect.attribute["stroke-dasharray"] : ""
);
watch(strokeDashoffset, () => {
  const ele = rect;
  if (strokeDashoffset.value) {
    ele.attribute["stroke-dasharray"] = strokeDashoffset.value;
  } else {
    if (ele.attribute["stroke-dasharray"]) {
      delete ele.attribute["stroke-dasharray"];
    }
  }
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
