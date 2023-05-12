<template>
    <div class="relative">
        <div
                class="col"
                :class="{ active: componentVue.select === 'circle' }"
                @click.stop="setSelectType('circle')"
        >
            <SyncOutlined/>
            <span>圆形</span>
        </div>
        <div class="rt" @click.stop="showModal(true)">
            <SettingOutlined />
        </div>
        <a-modal v-model:visible="visible" title="样式修改">
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </a-modal>
    </div>
</template>

<script setup>
    import {defineComponent, inject, reactive,ref} from 'vue';
    import {
        SyncOutlined,
        SettingOutlined,
    } from "@ant-design/icons-vue";
    import {SvgCircle} from "@/model/Shape";
    import $ from "jquery";
    import _ from 'lodash';

    const visible=ref(false)
    const showModal=(val)=>{
        visible.value=val
    }
    const getHandler=inject('getHandler')
    let componentVue=getHandler('componentVue',(h)=>{componentVue=h})
    const setSelectType = (type) => {
        if (componentVue.select===type)return
        let svgVue=getHandler('svgVue',(h)=>{svgVue=h})
        let handlerVue=getHandler('handlerVue',(h)=>{handlerVue=h})
        let resetType=getHandler('resetType',(h)=>{resetType=h})
        const set=(type)=>{
            let offset=null
            let ele = null
            const setAttr=(e)=>{
                if (!ele)return
                let xy=svgVue.clientToOffset(e.clientX,e.clientY)
                let x=_.ceil(xy.x-offset.x,2)
                let y=_.ceil(xy.y-offset.y,2)
                ele.attribute.r = _.ceil(Math.sqrt(x*x+y*y),2)
            }
            const containFun={
                mousemove:[
                    {
                        function:_.throttle(function (e) {
                            if (!ele&&e.target!=handlerVue.containRef)return
                                    setAttr(e)
                        },100),
                        useCapture:false
                    }
                ],
                mouseup:[
                    {
                        function: (e)=> {
                            if (!ele&&e.target!=handlerVue.containRef)return
                            setAttr(e)
                            ele=null
                            resetType()
                        },
                        useCapture:false
                    }
                ],
                mousedown:[
                    {
                        function:function (e) {
                            if (ele||e.target!=handlerVue.containRef)return
                            ele = SvgCircle.copy();
                            let xy=offset=svgVue.clientToOffset(e.clientX,e.clientY)
                            ele.attribute.cx = offset.x
                            ele.attribute.cy = offset.y
                            svgVue.getSvg().elements.push(ele)
                        },
                        useCapture:false
                    },
                ]
            }
            handlerVue.handler=containFun
            handlerVue.assignMsgPanelStyle({'pointer-events':'auto','cursor': 'crosshair'})
            componentVue.select=type
        }
        set(type)
    }

</script>

<style lang="less" scoped src="@/assets/menu_item.less">
</style>