<template>
    <div class="relative">
        <div
                class="col"
                :class="{ active: componentVue.select === 'polyline' }"
                @click.stop="setSelectType('polyline')"
        >
            <RadarChartOutlined/>
            <span>多线段</span>
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
    import {defineComponent, inject, provide, reactive, ref, watch} from 'vue';
    import {
        SettingOutlined,
        RadarChartOutlined,
    } from "@ant-design/icons-vue";
    import {SvgPolyline} from "@/model/Shape";
    import $ from "jquery";
    import {nanoid} from 'nanoid'
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
        let PolygonCmdSelect = getHandler('PolygonCmdSelect', (h) => {
            PolygonCmdSelect = h
        })
        const set = (type) => {
            let ele = null
            const containFun = {
                click: [
                    {
                        function: (e) => {
                            if (e.target != handlerVue.containRef) return
                            if (ele == null) {
                                ele = SvgPolyline.copy()
                                ele.posMap={}
                                ele.creating=true
                                svgVue.getSvg().elements.push(ele)
                            }
                            let xy = svgVue.clientToOffset(e.clientX, e.clientY)
                            let pos=[xy.x, xy.y]
                            ele.posMap[nanoid()]=pos
                            ele.pos.push(pos)
                            PolygonCmdSelect.keyHandler = function (key) {
                                switch (key) {
                                    case 'quit':
                                        if (ele){
                                            delete ele.creating
                                        }
                                        handlerVue.handler = null
                                        ele = null
                                        resetType()
                                        PolygonCmdSelect.setXY(false)
                                        break
                                }
                                PolygonCmdSelect.hideMenu()
                            }
                            PolygonCmdSelect.showMenu(e.clientX, e.clientY)
                        },
                        useCapture: false
                    },
                ],
                mousemove: [{
                    function: _.throttle(function (e) {
                        if (e.target != handlerVue.containRef) return
                        let xy = svgVue.clientToOffset(e.clientX, e.clientY)
                        PolygonCmdSelect.setXY(xy.x, xy.y, e.clientX, e.clientY, true)
                    }, 50),
                    useCapture: false
                },],
            }
            handlerVue.assignMsgPanelStyle({'pointer-events': 'auto', cursor: 'pointer'})
            handlerVue.handler = containFun
            componentVue.select = type
        }
        set(type)
    }

</script>

<style lang="less" scoped src="@/assets/menu_item.less">
</style>