<template>
    <div
            class="col"
            :class="{ active: componentVue.select === 'scale'}"
            @click.stop="setSelectType('scale')"
    >
        <zoom-in-outlined/>
        <span>缩放</span>
    </div>
</template>

<script setup>
    import {
        ZoomInOutlined,
    } from "@ant-design/icons-vue";
    import {defineComponent, inject, reactive, ref} from 'vue';
    import {SvgPath, SvgRect} from "@/model/Shape";
    import $ from "jquery";
    import {nanoid} from "nanoid";
    import _ from 'lodash';

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
            const containFun = {
                mousewheel: [
                    {
                        function: _.throttle((e) => {
                            let scale=svgVue.getScale()
                            if (e.wheelDelta > 0) {
                                svgVue.setScale(scale+10)
                            } else {
                                svgVue.setScale(scale-10)
                            }
                        }),
                        useCapture: false
                    },
                ]
            }
            handlerVue.handler = containFun
            handlerVue.assignMsgPanelStyle({'pointer-events': 'auto', 'cursor': 'pointer'})
            componentVue.select = type
        }
        set(type)
    }

</script>

<style lang="less" scoped src="@/assets/menu_item.less">
</style>