<template>
    <circle
            v-bind="circle.attribute"
            @mousedown="select"
            v-dot="'move'"
    >
    </circle>
    <g
            v-show="propVue.element===circle"
    >
<!--        中心-->
        <circle :cx="circle.attribute.cx" :cy="circle.attribute.cy" class="dot-gray" @mousedown="select" v-dot="'move'"/>
        <circle :cx="circle.attribute.cx" :cy="circle.attribute.cy" class="dot-white"/>
        <!--        右-->
        <circle :cx="rpoint.x" :cy="rpoint.y" class="e-resize dot-gray" v-dot="'r'"/>
        <circle :cx="rpoint.x" :cy="rpoint.y" class="dot-white"/>
    </g>
</template>

<script setup>
    import {defineComponent, inject, ref, computed, reactive, defineProps, defineExpose} from 'vue';
    import _ from 'lodash';
    import $ from "jquery";
    import {clone} from "@/model/Shape";
    import {nanoid} from "nanoid";
    const props=defineProps(['circle'])
    // eslint-disable-next-line vue/no-setup-props-destructure
    const circle=props.circle
    const rpoint = computed(() => {
        const attr = props.circle.attribute
        const ans = {x: 0, y: 0}
        ans.x = attr.cx + attr.r
        ans.y = attr.cy
        return ans
    })
    const getHandler = inject('getHandler')
    let svgVue = getHandler('svgVue', (h) => {
        svgVue = h
    })
    let handlerVue = getHandler('handlerVue', (h) => {
        handlerVue = h
    })
    let resetType = getHandler('resetType', (h) => {
        resetType = h
    })
    let propVue = getHandler('propVue', (h) => {
        propVue = h
    })
    const mousedown = function (e, type) {
        let ele = props.circle
        let oldAttr = {...ele.attribute}
        let mdXY = svgVue.clientToOffset(e.clientX, e.clientY)
        const setAttr = (e, type) => {
            if (!ele) return
            let xy = svgVue.clientToOffset(e.clientX, e.clientY)
            switch (type) {
                case 'r': {
                    let r = xy.x - oldAttr.cx
                    ele.attribute.r = Math.abs(r)
                    break;
                }
                case 'move': {
                    ele.attribute.cx = oldAttr.cx + xy.x - mdXY.x
                    ele.attribute.cy = oldAttr.cy + xy.y - mdXY.y
                    break;
                }
            }
        }
        const containFun = {
            mousemove: [
                {
                    function: _.throttle((e) => {
                        if (!ele && e.target != handlerVue.containRef) return
                        setAttr(e, type)
                    }, 100),
                    useCapture: false
                }
            ],
            mouseup: [
                {
                    function: function (e) {
                        if (!ele && e.target != handlerVue.containRef) return
                        setAttr(e, type)
                        ele = null
                        console.log('弹起')
                        resetType()
                    },
                    useCapture: false
                }
            ],
        }
        handlerVue.handler = containFun
        handlerVue.setMsgPanelStyle(reactive({'pointer-events': 'auto'}))
    }
    const select = () => {
        propVue.setElement(circle);
    };
    const vDot={
        mounted(el, binding) {
            const $el = $(el)
            const type = binding.value
            $el.bind('mousedown', (e) => {
                mousedown(e, type)
            })
        }
    }
    circle.COPY=()=>{
        let copy = _.omit(circle, ['SAVEFUN','COPY'])
        copy=clone(copy)
        copy.attribute.id=nanoid()
        return copy
    }
    circle.SAVEFUN=()=>{
        let save=_.omit(circle,['SAVEFUN','COPY'])
        return save
    }
</script>

<style scoped lang="less" src="@/assets/dot-style.less"></style>
<style scoped lang="less">
    .move {
        cursor: move;
    }

    .nw-resize {
        cursor: nw-resize;
    }

    .se-resize {
        cursor: se-resize;
    }

    .n-resize {
        cursor: n-resize;
    }

    .s-resize {
        cursor: s-resize;
    }

    .w-resize {
        cursor: w-resize;
    }

    .e-resize {
        cursor: e-resize;
    }

    .rotate {
        cursor: pointer;
    }

    .border-rect {
        stroke: #000000;
        stroke-width: 2;
        fill: none;
        /*pointer-events: none;*/
    }
</style>