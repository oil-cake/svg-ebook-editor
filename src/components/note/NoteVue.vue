<template>
  <foreignObject v-bind="note.attribute" class="note" >
    <a-popover trigger="click">
      <template #title>
        <div
          contenteditable="true"
          class="title"
          v-once
          v-html="note.title"
          @input="changeContent($event, note, 'title')"
        ></div>
      </template>
      <template #content>
        <div
          contenteditable="true"
          class="text"
          v-once
          v-html="note.text"
          @input="changeContent($event, note, 'text')"
        ></div>
      </template>
      <div :title="note.title" class="container" v-dot="'move'" ref="btn">
        <SnippetsOutlined />
      </div>
    </a-popover>
  </foreignObject>
</template>

<script setup>
  import {defineComponent, defineProps, inject, reactive,ref} from "vue";
import { SnippetsOutlined } from "@ant-design/icons-vue";
import _ from "lodash";
  import $ from "jquery";
const props = defineProps(["note"]);
// eslint-disable-next-line vue/no-setup-props-destructure
const note=props.note
const changeContent = _.debounce((e, ele, key) => {
  ele[key] = e.target.innerHTML;
}, 1000);
  const getHandler = inject("getHandler");
  let svgVue = getHandler('svgVue', (h) => {
    svgVue = h
  })
  let handlerVue = getHandler('handlerVue', (h) => {
    handlerVue = h
  })
  let resetType = getHandler('resetType', (h) => {
    resetType = h
  })
  let propVue = getHandler("propVue", (h) => {
    propVue = h;
  });
  const hasMove=ref(false)
  const btn=ref(null)
  const mousedown = function (e, type) {
    let ele = note
    let oldAttr = {...ele.attribute}
    let mdXY = svgVue.clientToOffset(e.clientX, e.clientY)
    const setAttr = (e, type) => {
      if (!ele) return
      let xy = svgVue.clientToOffset(e.clientX, e.clientY)
      switch (type) {
        case 'move': {
          ele.attribute.x = oldAttr.x + xy.x - mdXY.x
          ele.attribute.y = oldAttr.y + xy.y - mdXY.y
          break;
        }
      }
    }
    const containFun = {
      mousemove: [
        {
          function: _.throttle(function (e) {
            hasMove.value=true
            if (!ele && e.target != handlerVue.containRef) return
            setAttr(e, type)
          }, 100),
          useCapture: false
        }
      ],
      mouseup: [
        {
          function: function (e) {
            if (!hasMove.value){
              resetType()
              btn.value.click()
              return;
            }
            if (!ele && e.target != handlerVue.containRef) return
            setAttr(e, type)
            ele = null
            hasMove.value=false
            resetType()
          },
          useCapture: false
        }
      ],
    }
    handlerVue.handler = containFun
    handlerVue.setMsgPanelStyle(reactive({'pointer-events': 'auto'}))
  }
  const vDot = {
    mounted(el, binding) {
      const $el = $(el)
      const type = binding.value
      $el.bind('mousedown', (e) => {
        mousedown(e, type)
      })
    }
  }

note.SAVEFUN=()=>{
  let save=_.omit(note,['SAVEFUN'])
  return save
}
</script>

<style lang="less" scoped>

  .container{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    justify-items: center;
    justify-content: center;
    align-items: center;
    &:hover{
      background-color: #cccccc;
      color: white;
    }
  }
  .title {
    min-width: 100px;
    max-width: 300px;
    max-height: 100px;
    overflow-y: auto;
    font-size: 24px;
    font-weight: bold;
  }

  .text {
    min-width: 100px;
    max-width: 300px;
    max-height: 400px;
    overflow-y: auto;
    font-size: 18px;
    font-weight: normal;
  }
</style>
