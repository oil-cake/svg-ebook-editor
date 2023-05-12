<template>
    <foreignObject v-bind="video.attribute">
        <div class="bg" v-if="video.src" :style="video.bgStyle">
            <videoPlay
                    v-bind="options"
            />
            <div class="select-btn"
                 @click.self.stop="select"
            ></div>
        </div>
        <upload-vue v-else :options="op" @ChangeFile="getFile">
            <div :style="{width:video.attribute.width+'px',height:video.attribute.height+'px'}"
                 class="uploader-box">
                <div>
                    <play-square-outlined/>
                    choose
                </div>
            </div>
        </upload-vue>
    </foreignObject>
    <g :transform="video.attribute.transform" v-show="propVue.element === video">
        <rect
                v-bind="border_rect"
                class="border-rect"
        />
        <!--        左上-->
        <circle
                :cx="video.attribute.x"
                :cy="video.attribute.y"
                class="nw-resize dot-gray"
                v-dot="'lt'"
        />
        <circle :cx="video.attribute.x" :cy="video.attribute.y" class="dot-white"/>
        <line
                :x1="midpoint.x"
                :y1="video.attribute.y"
                :x2="midpoint.x"
                :y2="video.attribute.y - 20"
                stroke-width="2"
                stroke="black"
        />
        <!--        上-->
        <circle
                :cx="midpoint.x"
                :cy="video.attribute.y"
                class="n-resize dot-gray"
                v-dot="'t'"
        />
        <circle :cx="midpoint.x" :cy="video.attribute.y" class="dot-white"/>
        <!--        旋转点-->
        <circle
                :cx="midpoint.x"
                :cy="video.attribute.y - 20"
                class="rotate dot-gray"
                v-dot="'rotate'"
        />
        <circle
                :cx="midpoint.x"
                :cy="video.attribute.y - 20"
                class="rotate dot-white"
        />
        <!--        中点-->
\\
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
                :cx="video.attribute.x"
                :cy="midpoint.y"
                class="w-resize dot-gray"
                v-dot="'l'"
        />
        <circle
                :cx="video.attribute.x"
                :cy="midpoint.y"
                class="w-resize dot-white"
        />
        <!--        右上-->
        <circle :cx="brpoint.x" :cy="video.attribute.y" class="dot-gray"/>
        <circle :cx="brpoint.x" :cy="video.attribute.y" class="dot-white"/>
        <!--        左上-->
        <circle :cx="video.attribute.x" :cy="brpoint.y" class="dot-gray"/>
        <circle :cx="video.attribute.x" :cy="brpoint.y" class="dot-white"/>
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
    import {defineComponent, reactive, toRefs, ref, computed, watch, inject, defineProps} from 'vue';
    import {message} from 'ant-design-vue';
    import UploadVue from "@/components/upload/UploadVue.vue";
    import 'vue3-video-play/dist/style.css'
    import {videoPlay} from 'vue3-video-play'
    import {
        PlaySquareOutlined,
    } from "@ant-design/icons-vue";
    import $ from "jquery";
    import _ from "lodash";
    import {clone} from "@/model/Shape";
    import {nanoid} from "nanoid";

    const props = defineProps(['video'])
    // eslint-disable-next-line vue/no-setup-props-destructure
    const video = props.video
    // const video_array_buffer = ref(null)
    const getHandler = inject('getHandler')
    let dataMap = getHandler("dataMap", (h) => {
        dataMap = h;
    });
    const readZipFileAsync = getHandler('readZipFileAsync');

    if (video.src_id) {
        if (dataMap[video.src_id]) {
            // video_array_buffer.value = dataMap[video.src_id]
            video.src = URL.createObjectURL(new Blob([dataMap[video.src_id]]));
        } else {
            readZipFileAsync(video.src_id, 'uint8array').then((content) => {
                dataMap[video.src_id] = content
                // video_array_buffer.value = dataMap[video.src_id]
                video.src = URL.createObjectURL(new Blob([dataMap[video.src_id]]));
            })
        }
    }
    const getFile = (files) => {
        let file = files[0];
        let reader = new FileReader();
        reader.onload = function (event) {
            console.log('草泥马')
            video.src_id = nanoid()
            dataMap[video.src_id]=event.target.result
            video.src = URL.createObjectURL(new Blob([dataMap[video.src_id]]));
        };
        reader.readAsArrayBuffer(file);
    }
    const op = {
        accept: "video/*",
    };
    const midpoint = computed(() => {
        const ele = video.attribute
        const ans = {x: 0, y: 0}
        ans.x = ele.x + ele.width / 2
        ans.y = ele.y + ele.height / 2
        return ans
    })
    const brpoint = computed(() => {
        const ele = video.attribute
        const ans = {x: 0, y: 0}
        ans.x = ele.x + ele.width
        ans.y = ele.y + ele.height
        return ans
    })
    const options = reactive({
        width: computed(() => {
            return video.attribute.width + 'px'
        }), //播放器高度
        height: computed(() => {
            return video.attribute.height + 'px'
        }), //播放器高度
        color: "#409eff", //主题色
        src: computed(() => {
            return video.src
        }), //视频源
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
        propVue.setElement(video);
    };
    const mousedown = function (e, type) {

        let ele = video
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
    // const attr = video.attribute
    video.attribute.transform = computed(() => {
        if (!video.rotateAngle) return ''
        return `rotate(${video.rotateAngle},${midpoint.value.x},${midpoint.value.y})`
    })
    const vDot = {
        mounted(el, binding) {
            const $el = $(el)
            const type = binding.value
            $el.bind('mousedown', (e) => {
                mousedown(e, type)
            })
        }
    }

    video.COPY=()=>{
        let copy = _.omit(video, ['SAVEFUN','COPY'])
        copy=clone(copy)
        copy.attribute.id=nanoid()
        return copy
    }
    video.SAVEFUN = (zip, taskSet) => {
        let save = _.omit(video, ['SAVEFUN','COPY'])
        const taskId = nanoid()
        taskSet.add(taskId)
        if (!save.src_id)
            return save
        save.src = ''
        zip.file(save.src_id, dataMap[save.src_id], {binary: true, comment: 'video'});
        taskSet.delete(taskId)
        return save
    }
</script>

<style lang="less" scoped>
    .bg {
        width: 100%;
        height: 100%;
    }

    .uploader-box {
        user-select: none;
        font-size: 24px;
        color: #999;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-color: #a4aaad;
        text-align: center;

        &:hover {
            background-color: #6e7477;
        }
    }

    .move {
        cursor: move;
    }

    .nw-resize {
        cursor: nw-resize;
    }

    .se-resize {
        cursor: se-resize;
    }

    .n-resize {
        cursor: n-resize;
    }

    .s-resize {
        cursor: s-resize;
    }

    .w-resize {
        cursor: w-resize;
    }

    .e-resize {
        cursor: e-resize;
    }

    .rotate {
        cursor: pointer;
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