<template>
    <div>
        <div
                class="col"
                :class="{ active: componentVue.select === 'image' }"
                @click.stop="setSelectType('image')"
        >
            <FileImageOutlined/>
            <span>图片</span>
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
        FileImageOutlined,
        SettingOutlined,
    } from "@ant-design/icons-vue";
    import {SvgImage} from "@/model/Shape";
    import $ from "jquery";
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
            let ele = null
            const containFun = {
                click: [
                    {
                        function: function (e) {
                            if (e.target != handlerVue.containRef) return
                            let xy = svgVue.clientToOffset(e.clientX, e.clientY)
                            ele = SvgImage.copy();
                            ele.attribute.x = xy.x
                            ele.attribute.y = xy.y
                            svgVue.getSvg().elements.push(ele)
                            resetType()
                            ele = null
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