<template>
    <foreignObject v-bind="scale?board.attribute:expLoc"
                   class="no-event"
                   :style="board.bgStyle" ref="borderFO">
        <!--        缩小-->
        <div class="row auto-event" @click.stop="scale=true" ref="exp" v-show="!scale">
            <div class="c1">
                <ExpandOutlined/>
            </div>
        </div>

        <!--        正常-->
        <canvas class="ab" ref="canvas" v-bind="canvasWH" v-show="scale" :class="{'auto-event':checked,'no-event':!checked}"/>
        <div class="ab no-event none rect" :style="clearDivStyle"></div>
        <div class="row auto-event" v-show="showToolBar&&(barFix||scale&&!painting)">
            <div class="container" title="隐藏工具栏" @click="showToolBar=false">
                <MinusOutlined/>
            </div>
            <div class="container" title="选项">
                <a-switch v-model:checked="checked"/>
            </div>
            <div class="container" title="固定" @click.stop="barFix=!barFix">
                <pushpin-outlined :rotate="barFix?-45:0"/>
            </div>
            <div class="container" :class="{'tool-selected':selectTool==='pen'}" @click.stop="ChangeTool('pen')">
                <HighlightOutlined/>
            </div>
            <div class="container" @click.stop="scale=false" title="最小化">
                <CompressOutlined/>
            </div>
            <div class="container" @click.stop="ChangeTool('eraser')" title="清除"
                 :class="{'tool-selected':selectTool==='eraser'}">
                <BorderOutlined/>
            </div>
            <div class="container" @click.stop="">
                <div title="笔画颜色">
                    <color-picker
                            v-model:pureColor="paint.strokeStyle"
                            format="rgb"
                            shape="circle"
                            useType="pure"
                    />
                </div>
            </div>
            <div class="container" @click.stop="" style="width: 80px">
                <a-slider v-model:value="paint.lineWidth" :min="1" :max="30"/>
            </div>
            <div class="container" @click.stop="">
                <a-input-number v-model:value="paint.lineWidth" :min="1" :max="20"/>
            </div>


        </div>
        <div class="row auto-event" v-show="!showToolBar">
            <div class="container" title="显示工具栏" @click="showToolBar=true">
                <PlusOutlined/>
            </div>
        </div>
    </foreignObject>
</template>

<script setup>
    import {defineComponent, inject, ref, computed, reactive, watch, onMounted, toRefs, defineProps} from 'vue';
    import {clone} from "@/model/Shape";
    import {ColorPicker} from "vue3-colorpicker";
    import $ from 'jquery'
    import {nanoid} from "nanoid";


    import {
        HighlightOutlined,
        DeleteFilled,
        PushpinOutlined,
        ExpandOutlined,
        CompressOutlined,
        BgColorsOutlined,
        BorderOutlined,
        MinusOutlined,
        PlusOutlined,
    } from "@ant-design/icons-vue";
    import _ from 'lodash';

    const props = defineProps(['board'])
    // eslint-disable-next-line vue/no-setup-props-destructure
    const board=props.board
    const selectTool = ref('pen')
    const showToolBar=ref(true)
    const ChangeTool = (tool) => {
        selectTool.value = tool
    }
    const clearDivStyle = ref()
    const barFix = ref(false);
    const scale = ref(true)//true正常,false缩小
    const expLoc = computed(() => {
        const ans = reactive({x: 0, y: 0, width: 0, height: 0, id: ''})
        const ele = props.board
        ans.id = ele.attribute.id
        ans.x = ele.attribute.x
        ans.y = ele.attribute.y
        ans.width = 30
        ans.height = 30
        return ans
    })
    const upSwitch = computed(() => {
        const ans = reactive({x: 0, y: 0, width: 0, height: 0})
        const ele = props.board
        ans.x = ele.attribute.x
        ans.y = ele.attribute.y
        ans.width = 50
        ans.height = 30
        return ans
    })
    //画笔样式
    const paint = reactive({
        strokeStyle: 'black',
        lineWidth: 5,
        lineJoin: 'miter',
        lineCap: 'round',
    })
    const painting = ref(false)
    const canvas = ref(null)//canvas DOM
    const canvasWH = computed(() => {
        return {height: props.board.attribute.height, width: props.board.attribute.width}
    })
    const check = reactive({
        borderFO: null,
        checked: false,
    })
    const {borderFO, checked} = toRefs(check)

    const getHandler = inject("getHandler");
    let dataMap=getHandler("dataMap", (h) => {
        dataMap = h;
    });
    const readZipFileAsync=getHandler('readZipFileAsync');
    onMounted(() => {
        const canvasInit = () => {
            let canctx = canvas.value.getContext('2d');
            //初始化时设置的里面的内容
            const setImage = () => {
                const ele = props.board
                const image = new Image();
                // 加载 Base64 图片数据
                image.onload = function () {
                    // 绘制图片到 Canvas 上
                    canctx.drawImage(image, 0, 0, canvasWH.value.width, canvasWH.value.height);
                };
                if (ele.content_id) {
                    if (dataMap[ele.content_id]){
                        image.src=URL.createObjectURL(new Blob([dataMap[ele.content_id]]));
                    }else {
                        readZipFileAsync(ele.content_id,'uint8array').then((content)=>{
                            dataMap[ele.content_id]=content
                            image.src=URL.createObjectURL(new Blob([dataMap[ele.content_id]]));
                        })
                    }
                    // image.src = ele.content; // Base64图片数据
                }
                return
            }
            setImage()
            const setPaintPen = () => {
                console.log('pen初始化')
                canctx.strokeStyle = paint.strokeStyle;
                canctx.lineWidth = paint.lineWidth;
                canctx.lineJoin = paint.lineJoin;
                canctx.lineCap = paint.lineCap
                watch(paint, (nv, ov) => {
                    canctx.strokeStyle = paint.strokeStyle;
                    canctx.lineWidth = paint.lineWidth;
                    canctx.lineJoin = paint.lineJoin;
                    canctx.lineCap = paint.lineCap
                }, {immediate: true, deep: true})
            }
            setPaintPen()
            const lastXY = {x: 0, y: 0}
            const clear_rect = {x: 0, y: 0, width: 0, height: 0}
            const eraser_md = (e) => {
                clearDivStyle.value = reactive({display: 'block'})
                clear_rect.x = e.offsetX
                clear_rect.y = e.offsetY
                clearDivStyle.value.left = `${clear_rect.x}px`
                clearDivStyle.value.top = `${clear_rect.y}px`
            }
            const eraser_mm = _.throttle(
                (e) => {
                    clear_rect.width = e.offsetX - clear_rect.x
                    clear_rect.height = e.offsetY - clear_rect.y
                    clearDivStyle.value.width = `${clear_rect.width}px`
                    clearDivStyle.value.height = `${clear_rect.height}px`
                },100
            )
            const eraser_mu = (e) => {
                canctx.clearRect(clear_rect.x, clear_rect.y, clear_rect.width, clear_rect.height)
                clearDivStyle.value = reactive({})
            }
            const eraser_mo = (e) => {
                clearDivStyle.value = reactive({})
            }
            const eraser = {
                mousedown: eraser_md,
                mousemove: eraser_mm,
                mouseup: eraser_mu,
                mouseout: eraser_mo,
            }

            const drawLine = (x1, y1, x2, y2) => {
                canctx.beginPath();
                canctx.moveTo(x1, y1);
                canctx.lineTo(x2, y2);
                canctx.stroke();
            }
            const md = (e) => {
                e.stopPropagation();
                lastXY.x = e.offsetX
                lastXY.y = e.offsetY
                painting.value = true;
            }
            const mm = _.throttle((e) => {
                e.stopPropagation();
                if (painting.value === true) {
                    drawLine(lastXY.x, lastXY.y, e.offsetX, e.offsetY);
                    lastXY.x = e.offsetX
                    lastXY.y = e.offsetY
                }
            },0)
            const mu = (e) => {
                e.stopPropagation();
                canctx.save()
                painting.value = false;
            }
            const pen = {
                mousedown: md,
                mousemove: mm,
                mouseup: mu,
            }
            const $canvas = $(canvas.value)
            watch(selectTool, (nv, ov) => {
                if (nv == 'pen') {
                    $canvas.off(eraser)
                    $canvas.on(pen)
                } else {
                    $canvas.off(pen)
                    $canvas.on(eraser)
                }
            }, {immediate: true})
        }
        canvasInit()
    })


    // eslint-disable-next-line vue/no-mutating-props
    board.SAVEFUN=  (zip,taskSet)=>{
        const taskId=nanoid()
        taskSet.add(taskId)
        const save = _.omit(board, ['SAVEFUN','COPY'])
        save.content_id = nanoid()
        save.content = ''
        //异步函数
        canvas.value.toBlob(function (blob) {
            // 将图像二进制数据保存为文件
            zip.file(save.content_id, blob, {binary: true, comment: 'image'});
            taskSet.delete(taskId)
        }, "image/png");
        return save
    }

</script>

<style scoped lang="less" src="@/assets/dot-style.less"></style>
<style scoped lang="less" src="@/assets/direct.less"></style>
<style lang="less" scoped>
    .re {
        position: relative;
    }

    .ab {
        position: absolute;
    }

    .row {
        position: absolute;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        & > .c1 {
            border-radius: 50%;
            height: 30px;
            width: 30px;
            display: flex;
            justify-content: center;
            align-items: center;

            &:hover {
                color: cornsilk;
                background-color: cornflowerblue;
            }
        }


        .container {
            padding: 5px;

            &:hover {
                color: red;
            }
        }
    }

    .none {
        display: none;
    }

    .rect {
        border: black 1px dashed;
    }

    .no-event {
        pointer-events: none !important;
    }

    .auto-event {
        pointer-events: auto !important;
    }

    .tool-selected {
        color: red;
    }

    .border-rect {
        stroke: #000000;
        stroke-width: 2;
        fill: none;
    }
    .ab-suit-parent{
        top: 0;left: 0;right: 0;;bottom: 0;
    }

</style>