<template>
    <foreignObject v-bind="formula.attribute" v-dot="'move'" @mousedown="select">
        <div
                class="bg-class"
                :style="formula.bgStyle"
        >
            <vue-latex
                    :expression="formula.expression"
                    display-mode
                    :fontsize="formula.fontSize"
            />
        </div>
    </foreignObject>
    <g
            :transform="formula.attribute.transform"
            v-show="propVue.element === formula"
    >
        <rect v-bind="border_rect" class="border-rect"/>
        <!--        左上-->
        <circle
                :cx="formula.attribute.x"
                :cy="formula.attribute.y"
                class="nw-resize dot-gray"
                v-dot="'lt'"
        />
        <circle
                :cx="formula.attribute.x"
                :cy="formula.attribute.y"
                class="dot-white"
        />

        <line
                :x1="midpoint.x"
                :y1="formula.attribute.y"
                :x2="midpoint.x"
                :y2="formula.attribute.y - 20"
                stroke-width="2"
                stroke="black"
        />
        <!--        上-->
        <circle
                :cx="midpoint.x"
                :cy="formula.attribute.y"
                class="n-resize dot-gray"
                v-dot="'t'"
        />
        <circle :cx="midpoint.x" :cy="formula.attribute.y" class="dot-white"/>

        <!--        旋转点-->
        <circle
                :cx="midpoint.x"
                :cy="formula.attribute.y - 20"
                class="rotate dot-gray"
                v-dot="'rotate'"
        />
        <circle
                :cx="midpoint.x"
                :cy="formula.attribute.y - 20"
                class="rotate dot-white"
        />

        <!--        中点-->
<!--        <circle :cx="midpoint.x" :cy="midpoint.y" class="move dot-gray"/>-->
<!--        <circle :cx="midpoint.x" :cy="midpoint.y" class="move dot-white"/>-->
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
                :cx="formula.attribute.x"
                :cy="midpoint.y"
                class="w-resize dot-gray"
                v-dot="'l'"
        />
        <circle
                :cx="formula.attribute.x"
                :cy="midpoint.y"
                class="w-resize dot-white"
        />
        <!--        右上-->
        <circle :cx="brpoint.x" :cy="formula.attribute.y" class="dot-gray"/>
        <circle :cx="brpoint.x" :cy="formula.attribute.y" class="dot-white"/>

        <!--        左上-->
        <circle :cx="formula.attribute.x" :cy="brpoint.y" class="dot-gray"/>
        <circle :cx="formula.attribute.x" :cy="brpoint.y" class="dot-white"/>
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
    import {
        computed,
        defineComponent,
        inject,
        ref,
        reactive,
        defineProps,
    } from "vue";
    import {VueLatex} from "vatex";
    import $ from "jquery";
    import _ from "lodash";
    import {clone} from "@/model/Shape";
    import {nanoid} from "nanoid";

    const props = defineProps(["formula"]);
    // eslint-disable-next-line vue/no-setup-props-destructure
    const formula = props.formula;
    const getHandler = inject("getHandler");
    let propVue = getHandler("propVue", (h) => {
        propVue = h;
    });
    let svgVue = getHandler("svgVue", (h) => {
        svgVue = h;
    });
    let handlerVue = getHandler("handlerVue", (h) => {
        handlerVue = h;
    });
    let resetType = getHandler("resetType", (h) => {
        resetType = h;
    });
    const border_rect = computed(() => {
        const ele = props.formula.attribute;
        const ans = {};
        ans.x = ele.x;
        ans.y = ele.y;
        ans.width = ele.width;
        ans.height = ele.height;
        return ans;
    });
    const midpoint = computed(() => {
        const ele = props.formula.attribute;
        const ans = {x: 0, y: 0};
        ans.x = ele.x + ele.width / 2;
        ans.y = ele.y + ele.height / 2;
        return ans;
    });
    const brpoint = computed(() => {
        const ele = props.formula.attribute;
        const ans = {x: 0, y: 0};
        ans.x = ele.x + ele.width;
        ans.y = ele.y + ele.height;
        return ans;
    });
    const mousedown = function (e, type) {
        let ele = props.formula;
        let oldAttr = {...ele.attribute};
        let mdXY = svgVue.clientToOffset(e.clientX, e.clientY);
        const getTanDeg = (x, y) => {
            let tan = x / y;
            let angle = Math.atan(tan) / (Math.PI / 180);
            angle = Math.round(angle);
            if (x > 0 && y < 0) angle = -angle;
            else if (x > 0 && y > 0) angle = 180 - angle;
            else if (x < 0 && y > 0) angle = 180 - angle;
            else if (x < 0 && y < 0) angle = 360 - angle;
            return angle;
        };
        const setAttr = (e, type) => {
            if (!ele) return;
            let xy = svgVue.clientToOffset(e.clientX, e.clientY);
            switch (type) {
                case "rb": {
                    if (xy.x > oldAttr.x) {
                        ele.attribute.x = oldAttr.x;
                        ele.attribute.width = xy.x - oldAttr.x;
                    }
                    if (xy.y > oldAttr.y) {
                        ele.attribute.y = oldAttr.y;
                        ele.attribute.height = xy.y - oldAttr.y;
                    }
                    break;
                }
                case "lt": {
                    let x = oldAttr.x + oldAttr.width;
                    if (xy.x < x) {
                        ele.attribute.x = xy.x;
                        ele.attribute.width = x - xy.x;
                    }
                    let y = oldAttr.y + oldAttr.height;
                    if (xy.y < y) {
                        ele.attribute.y = xy.y;
                        ele.attribute.height = y - xy.y;
                    }
                    break;
                }
                case "t": {
                    let height = oldAttr.height + oldAttr.y - xy.y;
                    if (height > 0) {
                        ele.attribute.y = xy.y;
                        ele.attribute.height = height;
                    }
                    break;
                }
                case "r": {
                    let width = xy.x - oldAttr.x;
                    if (width >= 0) {
                        ele.attribute.width = width;
                    }
                    break;
                }
                case "l": {
                    let width = oldAttr.x + oldAttr.width - xy.x;
                    if (width >= 0) {
                        ele.attribute.width = width;
                        ele.attribute.x = xy.x;
                    }
                    break;
                }
                case "b": {
                    let height = xy.y - oldAttr.y;
                    if (height >= 0) {
                        ele.attribute.height = height;
                    }
                    break;
                }
                case "rotate": {
                    let y = xy.y - midpoint.value.y;
                    let x = xy.x - midpoint.value.x;
                    let angle = getTanDeg(x, y);
                    ele.rotateAngle = angle;
                    break;
                }
                case "move": {
                    ele.attribute.x = oldAttr.x + xy.x - mdXY.x;
                    ele.attribute.y = oldAttr.y + xy.y - mdXY.y;
                    break;
                }
            }
        };
        const containFun = {
            mousemove: [
                {
                    function: _.throttle(function (e) {
                        if (!ele && e.target != handlerVue.containRef) return;
                        setAttr(e, type);
                    }, 100),
                    useCapture: false,
                },
            ],
            mouseup: [
                {
                    function: function (e) {
                        if (!ele && e.target != handlerVue.containRef) return;
                        setAttr(e, type);
                        ele = null;
                        resetType();
                    },
                    useCapture: false,
                },
            ],
        };
        handlerVue.handler = containFun;
        handlerVue.setMsgPanelStyle(reactive({"pointer-events": "auto"}));
    };
    // eslint-disable-next-line vue/no-setup-props-destructure
    formula.attribute.transform = computed(() => {
        const ele = props.formula;
        if (!ele.rotateAngle) {
            delete ele.rotateAngle;
            return "";
        }
        return `rotate(${ele.rotateAngle},${midpoint.value.x},${midpoint.value.y})`;
    });
    const select = () => {
        propVue.setElement(formula);
    };
    const vDot = {
        mounted(el, binding) {
            const $el = $(el);
            const type = binding.value;
            $el.bind("mousedown", (e) => {
                mousedown(e, type);
            });
        },
    };

    formula.COPY=()=>{
        let copy = _.omit(formula, ['SAVEFUN','COPY'])
        copy=clone(copy)
        copy.attribute.id=nanoid()
        return copy
    }
    formula.SAVEFUN=()=>{
        let save=_.omit(formula,['SAVEFUN','COPY'])
        return save
    }
</script>

<style scoped lang="less" src="@/assets/dot-style.less"></style>
<style scoped lang="less" src="@/assets/direct.less"></style>
<style lang="less" scoped>
    .wrap {
        z-index: 100;
    }

    .bg-class {
        width: 100%;
        height: 100%;
        user-select: none;
        pointer-events: none;
    }

    .none-select {
        user-select: none;
    }

    .border-rect {
        stroke: #000000;
        stroke-width: 2;
        fill: none;
    }
</style>
