<template>
    <foreignObject v-bind="func.attribute" @dblclick="select">
        <div class="function-panel" ref="panelRef" :style="func.bgStyle">

        </div>
        <div class="select-btn"
             @mousedown="select"
             v-dot="'move'"
        ></div>
    </foreignObject>
    <g
            :transform="func.attribute.transform"
            v-show="propVue.element === func"
    >
        <rect
                v-bind="border_rect"
                class="border-rect"
        />
        <!--        左上-->
        <circle
                :cx="func.attribute.x"
                :cy="func.attribute.y"
                class="nw-resize dot-gray"
                v-dot="'lt'"
        />
        <circle :cx="func.attribute.x" :cy="func.attribute.y" class="dot-white"/>
        <line
                :x1="midpoint.x"
                :y1="func.attribute.y"
                :x2="midpoint.x"
                :y2="func.attribute.y - 20"
                stroke-width="2"
                stroke="black"
        />
        <!--        上-->
        <circle
                :cx="midpoint.x"
                :cy="func.attribute.y"
                class="n-resize dot-gray"
                v-dot="'t'"
        />
        <circle :cx="midpoint.x" :cy="func.attribute.y" class="dot-white"/>
        <!--        旋转点-->
        <circle
                :cx="midpoint.x"
                :cy="func.attribute.y - 20"
                class="rotate dot-gray"
                v-dot="'rotate'"
        />
        <circle
                :cx="midpoint.x"
                :cy="func.attribute.y - 20"
                class="rotate dot-white"
        />
        <!--        中点-->
        <circle :cx="midpoint.x" :cy="midpoint.y" class="move dot-gray" v-dot="'move'"/>
        <circle :cx="midpoint.x" :cy="midpoint.y" class="move dot-white"/>
        <!--        右-->
        <circle
                :cx="brpoint.x"
                :cy="midpoint.y"
                class="e-resize dot-gray"
                v-dot="'r'"
        />
        <circle :cx="brpoint.x" :cy="midpoint.y" class="e-resize dot-white"/>
        <!--        左-->
        <circle
                :cx="func.attribute.x"
                :cy="midpoint.y"
                class="w-resize dot-gray"
                v-dot="'l'"
        />
        <circle
                :cx="func.attribute.x"
                :cy="midpoint.y"
                class="w-resize dot-white"
        />
        <!--        右上-->
        <circle :cx="brpoint.x" :cy="func.attribute.y" class="dot-gray"/>
        <circle :cx="brpoint.x" :cy="func.attribute.y" class="dot-white"/>
        <!--        左上-->
        <circle :cx="func.attribute.x" :cy="brpoint.y" class="dot-gray"/>
        <circle :cx="func.attribute.x" :cy="brpoint.y" class="dot-white"/>
        <!--        下-->
        <circle
                :cx="midpoint.x"
                :cy="brpoint.y"
                class="s-resize dot-gray"
                v-dot="'b'"
        />
        <circle :cx="midpoint.x" :cy="brpoint.y" class="dot-white"/>
        <!--        右下-->
        <circle
                :cx="brpoint.x"
                :cy="brpoint.y"
                class="se-resize dot-gray"
                v-dot="'rb'"
        />
        <circle :cx="brpoint.x" :cy="brpoint.y" class="dot-white"/>
    </g>
</template>

<script setup>
    import {defineComponent, onMounted, ref, computed, inject, toRefs, defineProps, toRef, reactive} from 'vue';
    import functionPlot from 'function-plot'
    import _ from "lodash";
    import $ from "jquery";
    import {clone} from "@/model/Shape";
    import {nanoid} from "nanoid";

    const props = defineProps(['func'])

    // eslint-disable-next-line vue/no-setup-props-destructure
    const func = props.func
    const border_rect = computed(() => {
        const ele = func.attribute
        const ans = {};
        ans.x = ele.x
        ans.y = ele.y
        ans.width = ele.width
        ans.height = ele.height
        return ans
    })
    const midpoint = computed(() => {
        const ele = props.func.attribute;
        const ans = {x: 0, y: 0};
        ans.x = ele.x + ele.width / 2;
        ans.y = ele.y + ele.height / 2;
        return ans;
    });
    const brpoint = computed(() => {
        const ele = props.func.attribute;

        const ans = {x: 0, y: 0};
        ans.x = ele.x + ele.width;
        ans.y = ele.y + ele.height;
        return ans;
    });
    const panelRef = ref(null)
    const getHandler = inject('getHandler')
    const functionPlotInstance=ref()
    onMounted(() => {
        func.param.target = panelRef.value
        functionPlotInstance.value=functionPlot(func.param)
        console.log(func.param)
    })
    let svgVue = getHandler('svgVue', (h) => {
        svgVue = h
    })
    let handlerVue = getHandler('handlerVue', (h) => {
        handlerVue = h
    })
    let resetType = getHandler('resetType', (h) => {
        resetType = h
    })
    let propVue = getHandler("propVue", (h) => {
        propVue = h;
    });
    const select = () => {
        propVue.setElement(func);
    };
    const mousedown = function (e, type) {
        let ele = func
        let oldAttr = {...ele.attribute}
        let mdXY = svgVue.clientToOffset(e.clientX, e.clientY)
        const getTanDeg = (x, y) => {
            let tan = x / y
            let angle = Math.atan(tan) / (Math.PI / 180);
            angle = Math.round(angle);
            if (x > 0 && y < 0) angle = -angle
            else if (x > 0 && y > 0) angle = 180 - angle
            else if (x < 0 && y > 0) angle = 180 - angle
            else if (x < 0 && y < 0) angle = 360 - angle
            return angle;
        }
        const setAttr = (e, type) => {
            if (!ele) return
            let xy = svgVue.clientToOffset(e.clientX, e.clientY)
            switch (type) {
                case 'rb': {
                    if (xy.x > oldAttr.x) {
                        ele.attribute.x = oldAttr.x
                        ele.attribute.width = xy.x - oldAttr.x
                    }
                    if (xy.y > oldAttr.y) {
                        ele.attribute.y = oldAttr.y
                        ele.attribute.height = xy.y - oldAttr.y
                    }
                    break
                }
                case 'lt': {
                    let x = oldAttr.x + oldAttr.width
                    if (xy.x < x) {
                        ele.attribute.x = xy.x
                        ele.attribute.width = x - xy.x
                    }
                    let y = oldAttr.y + oldAttr.height
                    if (xy.y < y) {
                        ele.attribute.y = xy.y
                        ele.attribute.height = y - xy.y
                    }
                    break
                }
                case 't': {
                    let height = oldAttr.height + oldAttr.y - xy.y
                    if (height > 0) {
                        ele.attribute.y = xy.y
                        ele.attribute.height = height
                    }
                    break;
                }
                case 'r': {
                    let width = xy.x - oldAttr.x
                    if (width >= 0) {
                        ele.attribute.width = width
                    }
                    break;
                }
                case 'l': {
                    let width = oldAttr.x + oldAttr.width - xy.x
                    if (width >= 0) {
                        ele.attribute.width = width
                        ele.attribute.x = xy.x
                    }
                    break;
                }
                case 'b': {
                    let height = xy.y - oldAttr.y
                    if (height >= 0) {
                        ele.attribute.height = height
                    }
                    break;
                }
                case 'rotate': {
                    let y = xy.y - midpoint.value.y;
                    let x = xy.x - midpoint.value.x;
                    let angle = getTanDeg(x, y);
                    ele.rotateAngle = angle;
                    break;
                }
                case 'move': {
                    ele.attribute.x = oldAttr.x + xy.x - mdXY.x
                    ele.attribute.y = oldAttr.y + xy.y - mdXY.y
                    break;
                }
            }
        }
        const containFun = {
            mousemove: [
                {
                    function: _.throttle(function (e) {
                        if (!ele && e.target != handlerVue.containRef) return
                        setAttr(e, type)
                    }, 100),
                    useCapture: false
                }
            ],
            mouseup: [
                {
                    function: function (e) {
                        if (!ele && e.target != handlerVue.containRef) return
                        setAttr(e, type)
                        ele = null
                        resetType()
                    },
                    useCapture: false
                }
            ],
        }
        handlerVue.handler = containFun
        handlerVue.setMsgPanelStyle(reactive({'pointer-events': 'auto'}))
    }
    const vDot = {
        mounted(el, binding) {
            const $el = $(el)
            const type = binding.value
            $el.bind('mousedown', (e) => {
                mousedown(e, type)
            })
        }
    }
    func.attribute.transform = computed(() => {
        if (!func.rotateAngle) {
            return "";
        }
        return `rotate(${func.rotateAngle},${midpoint.value.x},${midpoint.value.y})`;
    });

    func.fnMap=new Map()
    if (func.param.data){
        //key初始化
        let d=func.param.data
        d.forEach((item)=>{
            func.fnMap.set(item.fn,nanoid())
        })
    }
    func.COPY=()=>{
        let copy = _.omit(func, ['SAVEFUN', 'ReDraw','fnMap','COPY'])
        copy=clone(copy)
        copy.attribute.id=nanoid()
        return copy
    }
    func.ReDraw = () => {
        functionPlotInstance.value.update(func.param);
    }
    func.SAVEFUN = (zip,taskSet) => {
        let save = _.omit(func, ['SAVEFUN', 'ReDraw','fnMap','COPY'])
        save = _.cloneDeep(save)
        let data = []
        if (save.param.data) {
            save.param.data.forEach((it) => {
                data.push({fn: it.fn, color: it.color})
            })
        }
        save.param.data = data
        save.param.target = null
        save.param.xAxis = {label: 'x'}
        save.param.yAxis = {label: 'y'}
        return save
    }

</script>

<style lang="less" scoped>
    .function-panel {
        width: 100%;
        height: 100%;
        position: absolute;
    }

    .icon {
        &:hover {
            color: blue;
        }
    }

    .border-rect {
        stroke: #000000;
        stroke-width: 2;
        fill: none;
    }

    .select-btn {
        background-color: red;
        height: 10px;
        width: 10px;
        border-radius: 50%;
        position: absolute;
        right: 5px;
        top: 5px;
        z-index: 3;
        box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
    }
</style>
<style scoped lang="less" src="@/assets/dot-style.less"></style>
<style scoped lang="less" src="@/assets/direct.less"></style>