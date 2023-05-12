<template>
    <div
            class="col"
            :class="{ active: componentVue.select === 'hand' }"
            @click.stop="setSelectType('hand')"
    >
        <DragOutlined/>
        <span>拖动</span>
    </div>
</template>

<script setup>
    import {
        DragOutlined,
    } from "@ant-design/icons-vue";
    import {defineComponent, inject, reactive, ref} from 'vue';
    import {SvgRect} from "@/model/Shape";
    import $ from 'jquery'
    import _ from "lodash";
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
        const set = (type) => {
            let client = {x: 0, y: 0}
            let move = false
            let rec = {left: 0, top: 0}
            const containFun = {
                mousemove: [
                    {
                        function: _.throttle(
                            (e) => {
                                if (!move || e.target != handlerVue.containRef) return
                                svgVue.assignSvgStyle({
                                    'left': rec.left + e.clientX - client.x + 'px',
                                    'top': rec.top + e.clientY - client.y + 'px',
                                })
                            }
                        ),
                        useCapture: false
                    }
                ],
                mouseup: [
                    {
                        function: (e) => {
                            if (!move || e.target != handlerVue.containRef) return
                            move = false
                        },
                        useCapture: false
                    }
                ],
                mousedown: [
                    {
                        function: function (e) {
                            if (e.target != handlerVue.containRef) return
                            client.x = e.clientX
                            client.y = e.clientY
                            let svgStyle = svgVue.getSvgStyle()
                            rec.left = svgStyle.left
                            rec.top = svgStyle.top
                            rec.left = rec.left ? parseInt(rec.left) : 0
                            rec.top = rec.top ? parseInt(rec.top) : 0
                            move = true
                        },
                        useCapture: false
                    },
                ],
            }
            handlerVue.handler = containFun
            handlerVue.assignMsgPanelStyle({'pointer-events': 'auto', 'cursor': 'move'})
            componentVue.select = type
        }
        set(type)
    }

</script>

<style lang="less" scoped src="@/assets/menu_item.less">
</style>