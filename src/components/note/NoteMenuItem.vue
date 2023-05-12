<template>
    <div
            class="col"
            :class="{ active: componentVue.select === 'note'}"
            @click.stop="setSelectType('note')"
    >
        <SnippetsOutlined/>
        <span>笔记</span>
    </div>
</template>

<script setup>

    import {defineComponent, inject, ref} from 'vue';
    import {
        SnippetsOutlined,
    } from "@ant-design/icons-vue";
    import {SvgNote} from "@/model/Shape";
    import $ from "jquery";
    import {nanoid} from "nanoid";

    const visible = ref(false)
    const showModal = (val) => {
        visible.value = val
    }

    const getHandler = inject('getHandler')
    let componentVue = getHandler('componentVue', (h) => {
        componentVue = h
    })
    const setSelectType = (type) => {
        if (componentVue.select === type) return
        let svgVue = getHandler('svgVue', (h) => {
            svgVue = h
        })
        let handlerVue = getHandler('handlerVue', (h) => {
            handlerVue = h
        })
        let resetType = getHandler('resetType', (h) => {
            resetType = h
        })
        const set = (type) => {
            let offset = null
            let ele = null
            const containFun = {
                mousedown: [
                    {
                        function: function (e) {
                            if (e.target != handlerVue.containRef) return
                            ele = SvgNote.copy();
                            let xy = offset = svgVue.clientToOffset(e.clientX, e.clientY)
                            ele.attribute.x = offset.x
                            ele.attribute.y = offset.y
                            svgVue.getSvg().elements.push(ele)
                        },
                        useCapture: false
                    },
                ],
                mouseup: [
                    {
                        function: (e) => {
                            if (e.target != handlerVue.containRef) return
                            ele = null
                            resetType()
                        },
                        useCapture: false
                    },
                ],
            }
            handlerVue.handler = containFun
            handlerVue.assignMsgPanelStyle({'pointer-events': 'auto', 'cursor': 'crosshair'})
            componentVue.select = type
        }
        set(type)
    }

</script>

<style lang="less" scoped src="@/assets/menu_item.less">
</style>