<template>
    <div class="ab panel">
        <div class="re-panel">
            <svg-vue v-for="it in svgList"  :svg="it" :key="it.attribute.id"/>
            <div class="msg-panel no-event" ref="containRef" :style="msgPanelStyle">
            </div>
            <path-cmd-select/>
            <polygon-cmd-select/>
        </div>
    </div>
    <div class="ab page">
        <a-pagination v-model:current="current" :total="svgList.length" v-model:page-size="pageSize"/>
    </div>
    <div class="scale">
        <a-slider v-model:value="scale" vertical :max="200" :min="10" :tip-formatter="formatter"/>
    </div>
</template>

<script setup>
    import {defineComponent, inject, onMounted, reactive, ref, watch, toRefs, computed, defineProps,} from 'vue';
    import PathCmdSelect from "@/components/path/PathCmdSelect";
    import PolygonCmdSelect from "@/components/polygon/PolygonCmdSelect";
    import SvgVue from "@/components/svg/SvgVue.vue";
    import {nanoid} from 'nanoid'
    import $ from 'jquery'
    import {Svg} from "@/model/Shape";
    import _ from 'lodash';

    const props = defineProps(['svgs'])
    // eslint-disable-next-line vue/no-setup-props-destructure
    const svgList = props.svgs
    const getHandler = inject('getHandler')
    const formatter = (value) => {
        return `${value}%`;
    };
    const msgPanelStyle = ref(reactive({}))
    const addHandler = inject("addHandler");
    const handlerVue = reactive({
        svgList: svgList,
        handler: {},
        containRef: null,
        assignMsgPanelStyle: (style) => {
            Object.assign(msgPanelStyle.value, style);
        },
        setMsgPanelStyle: (style) => {
            msgPanelStyle.value = style;
        },
        getMsgPanelStyle: () => {
            return msgPanelStyle.value
        },
        deleteSvg:(svg)=>{
            if (!svg||!svgList)return false
            let oldnum=svgList.length
            if (oldnum<=0)return false
            let newnum=svgList.splice(svgList.indexOf(svg),1).length
            if (oldnum>newnum){
                if (current.value){
                    current.value--
                }else {
                    current.value=svgList.length
                }
                return true
            }
            return false
        },
    })
    addHandler('handlerVue', handlerVue)
    watch(
        () => handlerVue.handler,
        (nv, ov) => {
            if (ov) {
                Object.entries(ov).forEach(([k, v]) => {
                    v.forEach((item, index) => {
                        handlerVue.containRef.removeEventListener(k, item.function, item.useCapture)
                    })
                });
            }
            if (nv) {
                Object.entries(nv).forEach(([k, v]) => {
                    v.forEach((item, index) => {
                        handlerVue.containRef.addEventListener(k, item.function, item.useCapture)
                    })
                });
            }
        },
        {immediate: true},
    );
    //缩放
    const scale = ref(100)
    watch(scale, _.throttle((nv, ov) => {
        svgVue.assignSvgStyle({
            'transform': 'scale(' + nv / 100 + ')'
        })
    }, 100))
    const current = ref(1)
    const svgVue = reactive({
        handler: {},
        svgRef: null,
        clientToOffset: (x, y,idx) => {
            let svg = svgList[idx?idx-1:current.value - 1]
            let boundRect = svg.svgRef.getBoundingClientRect();
            let width_scale = boundRect.width / svg.attribute.width;
            let height_scale = boundRect.height / svg.attribute.height;
            x = (x - boundRect.x) / width_scale;
            x = _.round(x, 2);
            y = (y - boundRect.y) / height_scale;
            y = _.round(y, 2)
            return {x: x, y: y};
        }, //坐标转换
        assignSvgStyle: (style, idx) => {
            if (!style) return;
            let index = idx ? idx-1 : current.value - 1
            let svgStyle = svgList[index].attribute.style;
            Object.assign(svgStyle, style);
        },
        getSvgStyle: (idx) => {
            return svgList[idx?idx-1:current.value - 1].attribute.style;
        },
        getSvg:(idx)=>{
            return svgList[idx?idx-1:current.value - 1];
        },

        setScale:(s)=>{
            scale.value=s
        },
        getScale:()=>{
            return scale.value
        },
    });
    addHandler("svgVue", svgVue);
    const listSvgVueRefs = ref([]);
    let propVue = getHandler("propVue", (h) => {
        propVue = h;
    });
    onMounted(() => {
        watch(current, (nv, ov) => {
            //隐藏上一个
            if (ov>0) {
                if (ov<=svgList.length)
                    svgVue.getSvg(ov).show=false
            }
            if (nv>0){
                svgVue.getSvg(nv).show=true
                propVue.setSvg(svgVue.getSvg(nv))
                propVue.setElement(null);
            }else {
                scale.value=100
                propVue.setSvg(null);
                propVue.setElement(null);
            }

        },{immediate:true})
    })
    const pageSize = ref(1)
    const {
        handler,
        containRef,
        assignMsgPanelStyle,
        setMsgPanelStyle,
        getMsgPanelStyle,
    } = toRefs(handlerVue)
</script>

<style lang="less" scoped>
    .ab {
        position: absolute;
    }

    .panel {
        top: 60px;
        right: 0;
        left: 0;
        bottom: 0;
    }

    .re-panel {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .msg-panel {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
    }

    .scale {
        position: absolute;
        bottom: 20px;
        right: 0;
        height: 100px;
        margin-right: 30px;
        z-index: 4;
    }

    .page {
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        justify-items: center;
    }

    .no-event {
        pointer-events: none;
    }

    .auto-event {
        pointer-events: auto;
    }
</style>