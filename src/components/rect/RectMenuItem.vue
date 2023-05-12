<template>
    <div class="relative">
        <div
                class="col"
                :class="{ active: componentVue.select === 'rect' }"
                @click.stop="setSelectType('rect')"
        >
            <BorderOutlined/>
            <span>矩形</span>
        </div>
        <div class="rt" @click.stop="showModal(true)">
            <SettingOutlined/>
        </div>
        <a-modal v-model:visible="visible" title="样式修改">
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </a-modal>
    </div>
</template>

<script setup>
    import {defineComponent, inject, reactive, ref} from 'vue';
    import {
        BorderOutlined,
        SettingOutlined,
    } from "@ant-design/icons-vue";
    import {SvgRect} from "@/model/Shape";
    import _ from 'lodash';

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
                mousemove: [
                    {
                        function: _.throttle(function (e) {
                            if (!ele && e.target != handlerVue.containRef) return
                            setAttr(e)
                        }, 100),
                        useCapture: false
                    }
                ],
                mouseup: [
                    {
                        function: (e) => {
                            if (!ele && e.target != handlerVue.containRef) return
                            setAttr(e)
                            ele = null
                            resetType()
                        },
                        useCapture: false
                    }
                ],
                mousedown: [
                    {
                        function: function (e) {
                            if (e.target != handlerVue.containRef) return
                            ele = SvgRect.copy();
                            console.log(ele);
                            let xy = offset = svgVue.clientToOffset(e.clientX, e.clientY)
                            ele.attribute.x = offset.x
                            ele.attribute.y = offset.y
                            svgVue.getSvg().elements.push(ele)
                            handlerVue.handler = containFun
                        },
                        useCapture: false
                    },
                ]
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