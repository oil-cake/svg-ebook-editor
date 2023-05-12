<template>
        <div
                class="col"
                :class="{ active: componentVue.select === 'arrow'||componentVue.select === '' }"
                @click.stop="setSelectType('arrow')"
        >
            <ArrowUpOutlined />
            <div>箭头</div>
        </div>
</template>

<script setup>
    import {
        ArrowUpOutlined,
    } from "@ant-design/icons-vue";
    import {defineComponent, inject, reactive, ref,defineProps} from 'vue';
    const getHandler=inject('getHandler')
    let componentVue=getHandler('componentVue',(h)=>{componentVue=h})
    const setSelectType = (type) => {
        if (!type&&componentVue.select===type)return
        let svgVue=getHandler('svgVue',(h)=>{svgVue=h})
        let handlerVue=getHandler('handlerVue',(h)=>{handlerVue=h})
        const set=(type)=>{
            const containFun=null
            const svgFun=null
            handlerVue.handler=containFun
            svgVue.handler=svgFun
            handlerVue.setMsgPanelStyle({});
            if (!type)return
            componentVue.select=type
        }
        set(type)
    }
    const resetType=(args)=>{
        setSelectType(args?args:'arrow');
    }
    const addHandler = inject("addHandler");
    addHandler('resetType',resetType)
</script>

<style lang="less" scoped src="@/assets/menu_item.less">
</style>