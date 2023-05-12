<template>
    <div class="relative">
        <div
                class="col"
                :class="{ active: componentVue.select === 'path' }"
                @click.stop="setSelectType('path')"
        >
            <MenuOutlined/>
            <span>路径</span>
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
        MenuOutlined,
        SettingOutlined,
    } from "@ant-design/icons-vue";
    import {SvgPath, SvgRect} from "@/model/Shape";
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
        let PathCmdSelect = getHandler('PathCmdSelect', (h) => {
            PathCmdSelect = h
        })
        let resetType = getHandler('resetType', (h) => {
            resetType = h
        })
        const set = (type) => {
            let ele = null
            let p = null
            const containFun = {
                click: [
                    {
                        function: function (e) {
                            if (e.target != handlerVue.containRef) return
                            if (ele == null) {
                                ele = SvgPath.copy();
                                ele.dot_map_arr=new Map()
                                ele.creating=true
                                p = [['M']]
                                addPos(e)
                                svgVue.getSvg().elements.push(ele)
                                return;
                            }
                            addPos(e)
                        },
                        useCapture: false
                    },
                ],
                mousemove: [{
                    function: _.throttle(function (e) {
                        if (e.target != handlerVue.containRef) return
                        let xy = svgVue.clientToOffset(e.clientX, e.clientY)
                        PathCmdSelect.setXY(xy.x, xy.y, e.clientX, e.clientY, true)
                        console.log('草泥马')
                    }, 100),
                    useCapture: false
                },],
            }
            const selectCmd = (e) => {
                PathCmdSelect.keyHandler = function (key) {
                    switch (key) {
                        case 'Z':
                            p = [[key]]
                            ele.pos.push(p)
                        // eslint-disable-next-line no-fallthrough
                        case 'quit':
                            if (ele){
                                delete ele.creating
                            }
                            handlerVue.handler = null
                            ele = null
                            resetType()
                            PathCmdSelect.setXY(false)
                            break
                    }
                    p = [[key]]
                    PathCmdSelect.hideMenu()
                }
                PathCmdSelect.showMenu(e.clientX, e.clientY)
            }
            const addPos = (e) => {
                if (!p) return
                let xy = svgVue.clientToOffset(e.clientX, e.clientY)
                let pos_arr = null
                let dot_arr=null
                switch (p[0][0]) {
                    case 'V': {
                        pos_arr = [xy.y]
                        break
                    }
                    case 'H': {
                        pos_arr = [xy.x]
                        break
                    }
                    default: {
                        pos_arr = [xy.x, xy.y]
                    }
                }
                dot_arr=[xy.x,xy.y]
                ele.pos_map[nanoid()] = dot_arr
                p.push(pos_arr)
                switch (p[0][0]) {
                    case 'C': {
                        if (p.length >= 4) {
                            ele.pos.push(p)
                            selectCmd(e)
                        }
                        break
                    }
                    case 'Q': {
                        if (p.length >= 3) {
                            ele.pos.push(p)
                            selectCmd(e)
                        }
                        break
                    }
                    default: {
                        if (ele.pos.length>0){
                            //不为第一个点时，可以删除点的记录表,多点命令不支持关联
                            ele.dot_map_arr.set(dot_arr,p)
                        }
                        ele.pos.push(p)
                        selectCmd(e)
                    }
                }
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