<template>
    <polyline v-bind="polyline.attribute" v-if="polyline"
              @mousedown="select"
              v-dot="'move'" class="move"
    >
    </polyline>
    <g :transform="polyline.attribute.transform" v-show="polyline.creating||propVue.element === polyline">
        <template v-for="(item, key) of polyline.posMap" :key="key">
            <circle :cx="item[0]" :cy="item[1]" class="dot-gray" @dblclick="deletePoint(key)">

            </circle>
            <circle :cx="item[0]" :cy="item[1]" class="dot-white">

            </circle>
        </template>
    </g>

</template>

<script setup>
    import {defineComponent, computed, defineProps, inject, reactive} from 'vue';
    import {clone} from "@/model/Shape";
    import {nanoid} from "nanoid";
    import _ from "lodash";
    import $ from "jquery";

    const props = defineProps([ 'polyline'])
    // eslint-disable-next-line vue/no-setup-props-destructure
    const polyline = props.polyline
    polyline.attribute.points = computed(() => {
        //转一维
        return polyline.pos.flat(Infinity).join(' ')
    })
    const deletePoint = (key) => {
        const pos = polyline.posMap[key]
        polyline.pos.splice(polyline.pos.indexOf(pos), 1)
        delete polyline.posMap[key]
    }
    polyline.SAVEFUN=()=>{
        let save=_.omit(polyline,['SAVEFUN','posMap'])
        return save
    }
    const getHandler = inject("getHandler");
    const getTransform = (str) => {
        let transform = reactive({})
        if (!str) {
            return transform
        }
        let r = new RegExp(" ", "gm")
        let rep = / /g
        let arr = str.replace(rep, '').split(/(?<=\))/g)
        let c = /(?<=\()(.+?)(?=\))/g
        arr.forEach((v, i, s) => {
            let key = v.split('(')[0]
            transform[key] = v.match(c)[0].split(',').map(Number)
        })
        return transform
    }
    const setTransform = (transform) => {
        let s = ''
        Object.keys(transform).forEach((key) => {
            s += (key + '(' + transform[key].join(',') + ')')
        })
        polyline.attribute.transform = s
    }
    const transform = getTransform(polyline.attribute.transform)
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
        let ele = props.polyline
        let oldAttr = {...ele.attribute}
        let mdXY = svgVue.clientToOffset(e.clientX, e.clientY)
        let old_translate = null
        const setAttr = (e, type) => {
            if (!ele) return
            let xy = svgVue.clientToOffset(e.clientX, e.clientY)
            switch (type) {
                case 'move': {
                    if (!transform.translate) {
                        transform.translate = [0, 0]
                    }
                    if (!old_translate){
                        old_translate=transform.translate.concat()
                    }
                    transform.translate[0] = old_translate[0]+xy.x-mdXY.x
                    transform.translate[1] = old_translate[1]+xy.y-mdXY.y
                    //更新数据
                    setTransform(transform)
                    break;
                }
            }
        }
        const containFun = {
            mousemove: [
                {
                    function: _.throttle(function (e) {
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
                        old_translate=null
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
    const select = () => {
        propVue.setElement(polyline);
    };
    polyline.COPY=()=>{
        let copy = _.omit(polyline, ['SAVEFUN','COPY'])
        copy=clone(copy)
        copy.attribute.id=nanoid()
        return copy
    }

    polyline.SAVEFUN=()=>{
        let save=_.omit(polyline,['SAVEFUN','COPY'])
        return save
    }
</script>

<style scoped lang="less" src="@/assets/dot-style.less"></style>
<style scoped lang="less" src="@/assets/direct.less"></style>

<style lang="less" scoped>

</style>