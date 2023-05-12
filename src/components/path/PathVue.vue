<template>
    <path v-bind="path.attribute"
          @mousedown="select"
          v-dot="'move'" class="move"
    >
    </path>
    <g :transform="path.attribute.transform" v-show="path.creating||propVue.element===path">
        <template v-for="(item, key) in path.pos_map" :key="key">
                    <circle :cx="item[0]" :cy="item[1]" class="dot-gray" @dblclick.stop="deletePoint(key)">

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

    const props = defineProps(['path'])
    // eslint-disable-next-line vue/no-setup-props-destructure
    const path = props.path
    const getHandler = inject('getHandler')
    path.attribute.d = computed(() => {
        //转一维
        return path.pos.flat(Infinity).join(' ')
    })
    const deletePoint = (key) => {
        let pos=path.pos_map[key]
        if (!pos)return;
        delete path.pos_map[key]
        let arr=path.dot_map_arr.get(pos)
        if (!arr)return
        path.pos.splice(path.pos.indexOf(arr),1)
    }

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
        path.attribute.transform = s
    }
    const transform = getTransform(path.attribute.transform)
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
        let ele = props.path
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
        propVue.setElement(path);
    };
    path.COPY=()=>{
        let copy = _.omit(path, ['SAVEFUN','COPY'])
        copy=clone(copy)
        copy.attribute.id=nanoid()
        return copy
    }
    path.SAVEFUN=()=>{
        let save=_.omit(path,['SAVEFUN','COPY'])
        return save
    }

</script>

<style scoped lang="less" src="@/assets/dot-style.less"></style>
<style scoped lang="less" src="@/assets/direct.less"></style>

<style lang="less" scoped>
    .q-line {
        stroke: #000000;
        stroke-width: 2;
        stroke-dasharray: 2;
    }
</style>