<template>
    <div class="relative">
        <div
                class="col"
                :class="{ active: componentVue.select === 'richText' }"
                @click.stop="setSelectType('richText')"
        >
            <EditOutlined/>
            <span>富文本</span>
        </div>
        <div class="rt">
            <SettingOutlined/>
        </div>
    </div>
</template>
<script setup>
    import {defineComponent, inject, reactive, ref, onMounted} from 'vue';
    import {
        EditOutlined,
        SettingOutlined,
    } from "@ant-design/icons-vue";
    import {SvgRichText} from "@/model/Shape";
    import $ from "jquery";
    import _ from "lodash";

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
            const setAttr = (e) => {
                if (!ele) return
                let xy = svgVue.clientToOffset(e.clientX, e.clientY)
                let x = xy.x - offset.x
                if (x < 0) {
                    ele.attribute.x = offset.x + x
                    ele.attribute.width = -x
                } else {
                    ele.attribute.x = offset.x
                    ele.attribute.width = x
                }
                let y = xy.y - offset.y
                if (y < 0) {
                    ele.attribute.y = offset.y + y
                    ele.attribute.height = -y
                } else {
                    ele.attribute.y = offset.y
                    ele.attribute.height = y
                }
            }
            const containFun = {
                mousedown: [
                    {
                        function: (e) => {
                            if (e.target != handlerVue.containRef) return
                            ele = SvgRichText.copy();
                            let xy = offset = svgVue.clientToOffset(e.clientX, e.clientY)
                            ele.attribute.x = offset.x
                            ele.attribute.y = offset.y
                            svgVue.getSvg().elements.push(ele)
                        },
                        useCapture: false
                    },
                ],
                mousemove: [
                    {
                        function: _.throttle((e) => {
                            if (!ele && e.target != handlerVue.containRef) return
                            const time = ref(null)
                            if (time.value == null) {
                                time.value = setTimeout(() => {
                                    setAttr(e)
                                    time.value = null
                                }, 100)
                            }
                        }, 100),
                        useCapture: false
                    }
                ],
                mouseup: [
                    {
                        function: (e) => {
                            // console.log('up',e)
                            if (!ele && e.target != handlerVue.containRef) return
                            setAttr(e)
                            ele = null
                            resetType()
                        },
                        useCapture: false
                    }
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