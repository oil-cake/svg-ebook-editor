<template>
  <div
    class="pu btn"
    :class="{ 'btn-fold': fold, 'btn-unfold': !fold }"
    @click="fold = !fold"
  >
    <RightOutlined v-if="!fold" />
    <LeftOutlined v-else />
  </div>
  <div class="pu tab" :class="{ 'ct-fold': fold, 'ct-unfold': !fold }">
    <div>
      选中元素：
      <a-select
        v-model:value="elementKey"
        style="width: 80%; max-height: 500px"
        @select="propVue.select"
      >
        <a-select-option :value="null"> 未选中 </a-select-option>
        <template v-if="svg">
          <a-select-option
            v-for="item in svg.elements"
            :value="item.attribute.id"
            :key="item.attribute.id"
            :item="item"
          >
            {{ item.attribute.id }}
          </a-select-option>
        </template>
      </a-select>
      <a-button>
        <template #icon><RedoOutlined /></template>
        刷新 </a-button>
      <a-button type="primary" @click="CopyElement">
        <template #icon><CopyOutlined /></template>
        复制
      </a-button>
      <a-button type="primary" danger @click="DeleteElement">
        <template #icon><delete-outlined /></template>
        删除 </a-button>
    </div>
<!--    <div v-if="eleTemp"></div>-->
    <a-tabs type="card">
      <a-tab-pane key="1" tab="样式">
        <div style="overflow: auto;">
          <template v-if="element">
            <template v-if="!element"></template>
            <rect-style :ele="element" v-else-if="element.type === 'rect'" />
            <function-style
                    :ele="element"
                    v-else-if="element.type === 'function'"
            />
            <rich-text-style
                    :ele="element"
                    v-else-if="element.type === 'richText'"
            />
            <formula-style
                    :ele="element"
                    v-else-if="element.type === 'formula'"
            />
            <circle-style :ele="element" v-else-if="element.type === 'circle'" />
            <path-style :ele="element" v-else-if="element.type === 'path'" />
            <svg-style :ele="element" v-else-if="element.type === 'svg'" />
            <image-style :ele="element" v-else-if="element.type === 'image'"/>
            <board-style :ele="element" v-else-if="element.type === 'board'"/>
            <video-style :ele="element" v-else-if="element.type === 'video'"/>
            <polygon-style :ele="element" v-else-if="element.type === 'polygon'"/>
            <polyline-style :ele="element" v-else-if="element.type === 'polyline'"/>
            <audio-style :ele="element" v-else-if="element.type === 'audio'"/>
          </template>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="动画">Content of Tab Pane 2</a-tab-pane>
      <a-tab-pane key="3" tab="交互">Content of Tab Pane 3</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import {
  defineComponent,
  inject,
  ref,
  reactive,
  computed,
  watch,
  toRefs,
} from "vue";
import RectStyle from "@/components/rect/RectStyle.vue";
import FunctionStyle from "@/components/function/FunctionStyle";
import RichTextStyle from "@/components/richtext/RichTextStyle";
import FormulaStyle from "@/components/formula/FormulaStyle";
import CircleStyle from "@/components/circle/CircleStyle";
import PathStyle from "@/components/path/PathStyle";
import SvgStyle from "@/components/svg/SvgStyle";
import ImageStyle from "@/components/image/ImageStyle"
import BoardStyle from "@/components/board/BoardStyle"
import VideoStyle from "@/components/video/VideoStyle"
import PolygonStyle from "@/components/polygon/PolygonStyle"
import PolylineStyle from "@/components/polyline/PolylineStyle"
import AudioStyle from "@/components/audio/AudioStyle"
import { LeftOutlined, RightOutlined,DeleteOutlined,CopyOutlined,RedoOutlined } from "@ant-design/icons-vue";

const fold = ref(true);
const addHandler = inject("addHandler");
const getHandler = inject('getHandler')

const elementKey = ref(null);
const propVue = reactive({
  element: null,
  svg: null,
  setSvg:(svg)=>{
    propVue.svg=svg
  },
  setElement:(ele)=>{
    propVue.element=ele
    if (ele){
      elementKey.value=ele.attribute.id
    }else {
      elementKey.value=null
    }
  }
});
const {  element, svg,}=toRefs(propVue)
addHandler("propVue", propVue);

let handlerVue = getHandler("handlerVue", (h) => {
  handlerVue = h;
});
const DeleteElement=()=>{


  if (propVue.svg==propVue.element){
    handlerVue.deleteSvg(propVue.svg)
  }

  let list=propVue.svg.elements
  let ele=propVue.element
  list.splice(list.indexOf(ele),1)
  propVue.element=null
}
const CopyElement=()=>{
  let list=propVue.svg.elements
  let ele=propVue.element
  let copy=ele.COPY()
  list.push(copy)
  console.log('copy',copy)
}
</script>

<style lang="less" scoped>
.pu {
  transition-property: all;
  transition-duration: 0.5s;
  transition-timing-function: ease;
  transition-delay: 0s;
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #cccccc;
}

.btn-fold {
  right: 0;
}

.btn-unfold {
  right: 125px;
}

.tab {
  position: absolute;
  top: 60px;
  width: 300px;
  background-color: white;
  padding: 10px;
}

.ct-fold {
  right: -300px;
}

.ct-unfold {
  right: 0;
}
</style>
