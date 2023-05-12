<template>
  <rect v-bind="rect.attribute" @mousedown="select" v-dot="'move'"> </rect>
  <g :transform="rect.attribute.transform" v-show="propVue.element === rect">
    <rect
      v-bind="border_rect"
      class="border-rect"
      v-if="!rect.attribute['stroke-width']"
    />
    <!--        左上-->
    <circle
      :cx="rect.attribute.x"
      :cy="rect.attribute.y"
      class="nw-resize dot-gray"
      v-dot="'lt'"
    />
    <circle :cx="rect.attribute.x" :cy="rect.attribute.y" class="dot-white" />
    <line
      :x1="midpoint.x"
      :y1="rect.attribute.y"
      :x2="midpoint.x"
      :y2="rect.attribute.y - 20"
      stroke-width="2"
      stroke="black"
    />
    <!--        上-->
    <circle
      :cx="midpoint.x"
      :cy="rect.attribute.y"
      class="n-resize dot-gray"
      v-dot="'t'"
    />
    <circle :cx="midpoint.x" :cy="rect.attribute.y" class="dot-white" />
    <!--        旋转点-->
    <circle
      :cx="midpoint.x"
      :cy="rect.attribute.y - 20"
      class="rotate dot-gray"
      v-dot="'rotate'"
    />
    <circle
      :cx="midpoint.x"
      :cy="rect.attribute.y - 20"
      class="rotate dot-white"
    />
    <!--        中点-->
    <circle :cx="midpoint.x" :cy="midpoint.y" class="move dot-gray" />
    <circle :cx="midpoint.x" :cy="midpoint.y" class="move dot-white" />
    <!--        右-->
    <circle
      :cx="brpoint.x"
      :cy="midpoint.y"
      class="e-resize dot-gray"
      v-dot="'r'"
    />
    <circle :cx="brpoint.x" :cy="midpoint.y" class="e-resize dot-white" />
    <!--        左-->
    <circle
      :cx="rect.attribute.x"
      :cy="midpoint.y"
      class="w-resize dot-gray"
      v-dot="'l'"
    />
    <circle
      :cx="rect.attribute.x"
      :cy="midpoint.y"
      class="w-resize dot-white"
    />
    <!--        右上-->
    <circle :cx="brpoint.x" :cy="rect.attribute.y" class="dot-gray" />
    <circle :cx="brpoint.x" :cy="rect.attribute.y" class="dot-white" />
    <!--        左上-->
    <circle :cx="rect.attribute.x" :cy="brpoint.y" class="dot-gray" />
    <circle :cx="rect.attribute.x" :cy="brpoint.y" class="dot-white" />
    <!--        下-->
    <circle
      :cx="midpoint.x"
      :cy="brpoint.y"
      class="s-resize dot-gray"
      v-dot="'b'"
    />
    <circle :cx="midpoint.x" :cy="brpoint.y" class="dot-white" />
    <!--        右下-->
    <circle
      :cx="brpoint.x"
      :cy="brpoint.y"
      class="se-resize dot-gray"
      v-dot="'rb'"
    />
    <circle :cx="brpoint.x" :cy="brpoint.y" class="dot-white" />
  </g>
</template>

<script setup>
import {
  defineComponent,
  inject,
  ref,
  computed,
  reactive,
  defineProps,
  defineExpose,
} from "vue";
import _ from "lodash";
import $ from "jquery";
import {clone} from "@/model/Shape";
import {nanoid} from "nanoid";

const props = defineProps(["rect"]);
// eslint-disable-next-line vue/no-setup-props-destructure
const rect = props.rect;
const border_rect = computed(() => {
  const ele = props.rect.attribute;
  const ans = {};
  ans.x = ele.x;
  ans.y = ele.y;
  ans.width = ele.width;
  ans.height = ele.height;
  return ans;
});
const midpoint = computed(() => {
  const ele = props.rect.attribute;
  const ans = { x: 0, y: 0 };
  ans.x = ele.x + ele.width / 2;
  ans.y = ele.y + ele.height / 2;
  return ans;
});
const brpoint = computed(() => {
  const ele = props.rect.attribute;
  const ans = { x: 0, y: 0 };
  ans.x = ele.x + ele.width;
  ans.y = ele.y + ele.height;
  return ans;
});
const getHandler = inject("getHandler");
let svgVue = getHandler("svgVue", (h) => {
  svgVue = h;
});
let handlerVue = getHandler("handlerVue", (h) => {
  handlerVue = h;
});
let resetType = getHandler("resetType", (h) => {
  resetType = h;
});
let propVue = getHandler("propVue", (h) => {
  propVue = h;
});

rect.attribute.transform = computed(() => {
  if (!rect.rotateAngle) {
    return "";
  }
  return `rotate(${rect.rotateAngle},${midpoint.value.x},${midpoint.value.y})`;
});
const mousedown = function (e, type) {
  let ele = props.rect;
  let oldAttr = { ...ele.attribute };
  let mdXY = svgVue.clientToOffset(e.clientX, e.clientY);
  const getTanDeg = (x, y) => {
    let tan = x / y;
    let angle = Math.atan(tan) / (Math.PI / 180);
    angle = Math.round(angle);
    if (x > 0 && y < 0) angle = -angle;
    else if (x > 0 && y > 0) angle = 180 - angle;
    else if (x < 0 && y > 0) angle = 180 - angle;
    else if (x < 0 && y < 0) angle = 360 - angle;
    return angle;
  };
  const setAttr = (e, type) => {
    if (!ele) return;
    let xy = svgVue.clientToOffset(e.clientX, e.clientY);
    switch (type) {
      case "rb": {
        if (xy.x > oldAttr.x) {
          ele.attribute.x = oldAttr.x;
          ele.attribute.width = xy.x - oldAttr.x;
        }
        if (xy.y > oldAttr.y) {
          ele.attribute.y = oldAttr.y;
          ele.attribute.height = xy.y - oldAttr.y;
        }
        break;
      }
      case "lt": {
        let x = oldAttr.x + oldAttr.width;
        if (xy.x < x) {
          ele.attribute.x = xy.x;
          ele.attribute.width = x - xy.x;
        }
        let y = oldAttr.y + oldAttr.height;
        if (xy.y < y) {
          ele.attribute.y = xy.y;
          ele.attribute.height = y - xy.y;
        }
        break;
      }
      case "t": {
        let height = oldAttr.height + oldAttr.y - xy.y;
        if (height > 0) {
          ele.attribute.y = xy.y;
          ele.attribute.height = height;
        }
        break;
      }
      case "r": {
        let width = xy.x - oldAttr.x;
        if (width >= 0) {
          ele.attribute.width = width;
        }
        break;
      }
      case "l": {
        let width = oldAttr.x + oldAttr.width - xy.x;
        if (width >= 0) {
          ele.attribute.width = width;
          ele.attribute.x = xy.x;
        }
        break;
      }
      case "b": {
        let height = xy.y - oldAttr.y;
        if (height >= 0) {
          ele.attribute.height = height;
        }
        break;
      }
      case "rotate": {
        let y = xy.y - midpoint.value.y;
        let x = xy.x - midpoint.value.x;
        let angle = getTanDeg(x, y);
        ele.rotateAngle = angle;
        break;
      }
      case "move": {
        ele.attribute.x = oldAttr.x + xy.x - mdXY.x;
        ele.attribute.y = oldAttr.y + xy.y - mdXY.y;
        break;
      }
    }
  };
  const containFun = {
    mousemove: [
      {
        function: _.throttle((e) => {
          if (!ele && e.target != handlerVue.containRef) return;
          setAttr(e, type);
        }, 100),
        useCapture: false,
      },
    ],
    mouseup: [
      {
        function: function (e) {
          if (!ele && e.target != handlerVue.containRef) return;
          setAttr(e, type);
          ele = null;
          console.log("弹起");
          resetType();
        },
        useCapture: false,
      },
    ],
  };
  handlerVue.handler = containFun;
  handlerVue.setMsgPanelStyle(
    reactive({ "pointer-events": "auto", cursor: "move" })
  );
};
const select = () => {
  propVue.setElement(rect);

};
const vDot = {
  mounted(el, binding) {
    const $el = $(el);
    const type = binding.value;
    $el.bind("mousedown", (e) => {
      mousedown(e, type);
    });
  },
};

rect.COPY=()=>{
  let copy = _.omit(rect, ['SAVEFUN','COPY'])
  copy=clone(copy)
  copy.attribute.id=nanoid()
  return copy
}
rect.SAVEFUN=()=>{
  let save=_.omit(rect,['SAVEFUN','COPY'])
  return save
}
</script>

<style scoped lang="less" src="@/assets/dot-style.less"></style>
<style scoped lang="less" src="@/assets/direct.less"></style>

<style scoped lang="less">
.border-rect {
  stroke: #000000;
  stroke-width: 2;
  fill: none;
}
</style>
