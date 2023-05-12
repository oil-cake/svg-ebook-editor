<template>
    <foreignObject v-bind="image.attribute" @mousedown="select">
        <a-image
                :width="image.attribute.width"
                :height="image.attribute.height"
                :src="image.src" v-if="image.src" class="none-event"
                :preview="image.preview"
                alt="图片不存在"
        />
        <upload-vue v-else :options="op" @ChangeFile="getFile">
            <div :style="{width:image.attribute.width+'px',height:image.attribute.height+'px'}" class="uploader-box">
                <div>
                    <FileImageOutlined/>
                </div>
                <div>choose</div>
            </div>
        </upload-vue>
    </foreignObject>
    <g :transform="image.attribute.transform" v-show="propVue.element === image">
        <rect
                v-bind="border_rect"
                class="border-rect"
        />
        <!--        左上-->
        <circle
                :cx="image.attribute.x"
                :cy="image.attribute.y"
                class="nw-resize dot-gray"
                v-dot="'lt'"
        />
        <circle :cx="image.attribute.x" :cy="image.attribute.y" class="dot-white"/>
        <line
                :x1="midpoint.x"
                :y1="image.attribute.y"
                :x2="midpoint.x"
                :y2="image.attribute.y - 20"
                stroke-width="2"
                stroke="black"
        />
        <!--        上-->
        <circle
                :cx="midpoint.x"
                :cy="image.attribute.y"
                class="n-resize dot-gray"
                v-dot="'t'"
        />
        <circle :cx="midpoint.x" :cy="image.attribute.y" class="dot-white"/>
        <!--        旋转点-->
        <circle
                :cx="midpoint.x"
                :cy="image.attribute.y - 20"
                class="rotate dot-gray"
                v-dot="'rotate'"
        />
        <circle
                :cx="midpoint.x"
                :cy="image.attribute.y - 20"
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
                :cx="image.attribute.x"
                :cy="midpoint.y"
                class="w-resize dot-gray"
                v-dot="'l'"
        />
        <circle
                :cx="image.attribute.x"
                :cy="midpoint.y"
                class="w-resize dot-white"
        />
        <!--        右上-->
        <circle :cx="brpoint.x" :cy="image.attribute.y" class="dot-gray"/>
        <circle :cx="brpoint.x" :cy="image.attribute.y" class="dot-white"/>
        <!--        左上-->
        <circle :cx="image.attribute.x" :cy="brpoint.y" class="dot-gray"/>
        <circle :cx="image.attribute.x" :cy="brpoint.y" class="dot-white"/>
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

    import {defineComponent, reactive, toRefs, ref, computed, watch, defineProps, inject} from 'vue';
    import {message} from 'ant-design-vue';
    import UploadVue from "@/components/upload/UploadVue.vue";
    import {
        FileImageOutlined,
    } from "@ant-design/icons-vue";
    import _ from "lodash";
    import $ from "jquery";
    import {clone} from "@/model/Shape";
    import {nanoid} from "nanoid";

    const op = {
        accept: [".png",".jpeg",".gif",".bmp",".jpg"],
    };
    const props = defineProps(['image'])
    // eslint-disable-next-line vue/no-setup-props-destructure
    const ele = props.image
    // eslint-disable-next-line vue/no-setup-props-destructure
    const image = props.image
    const border_rect = computed(() => {
        const ele = props.image.attribute;
        const ans = {};
        ans.x = ele.x;
        ans.y = ele.y;
        ans.width = ele.width;
        ans.height = ele.height;
        return ans;
    });
    const midpoint = computed(() => {
        const ele = props.image.attribute;

        const ans = {x: 0, y: 0};
        ans.x = ele.x + ele.width / 2;
        ans.y = ele.y + ele.height / 2;
        return ans;
    });
    const brpoint = computed(() => {
        const ele = props.image.attribute;

        const ans = {x: 0, y: 0};
        ans.x = ele.x + ele.width;
        ans.y = ele.y + ele.height;
        return ans;
    });
    const getHandler = inject("getHandler");
    let dataMap = getHandler("dataMap", (h) => {
        dataMap = h;
    });
    const readZipFileAsync = getHandler('readZipFileAsync');
    if (image.src_id) {
        if (dataMap[image.src_id]) {
            image.src = URL.createObjectURL(new Blob([dataMap[image.src_id]]));
        } else {
            readZipFileAsync(image.src_id, 'uint8array').then((content) => {
                dataMap[image.src_id] = content
                image.src = URL.createObjectURL(new Blob([dataMap[image.src_id]]));
            })
        }
    }
    const getFile = (files) => {
        let file = files[0];
        let reader = new FileReader();
        let url = URL.createObjectURL(file)
        reader.onload = function (event) {
            image.src_id = nanoid()
            dataMap[image.src_id]=event.target.result
            image.src = URL.createObjectURL(new Blob([dataMap[image.src_id]]));

        };
        let img = new Image();
        img.onload = () => {
            ele.attribute.height = (ele.attribute.width) / img.naturalWidth * img.naturalHeight
            reader.readAsArrayBuffer(file);
        };
        img.src = url;
    }


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
    const mousedown = function (e, type) {

        let ele = image
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


    ele.attribute.transform = computed(() => {
        if (!ele.rotateAngle) {
            return "";
        }
        return `rotate(${ele.rotateAngle},${midpoint.value.x},${midpoint.value.y})`;
    });
    const select = () => {
        propVue.setElement(image);
    };
    image.COPY=()=>{
        let copy = _.omit(image, ['SAVEFUN','COPY'])
        copy=clone(copy)
        copy.attribute.id=nanoid()
        return copy
    }
    image.SAVEFUN = (zip, taskSet) => {
        const taskId = nanoid()
        taskSet.add(taskId)
        const save = _.omit(image, ['SAVEFUN','COPY'])
        if (!save.src_id)
            return save
        save.src = ''
        zip.file(save.src_id, dataMap[save.src_id], {binary: true, comment: 'image'});
        taskSet.delete(taskId)
        return save
    }


</script>

<style lang="less" scoped>

    .test {
        /*:hover {*/
        /*    background-color: #6e7477;*/
        /*}*/

        /*> * {*/
        /*    user-select: none;*/
        /*}*/
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

    .center-text {
        text-align: center;
        vertical-align: middle;
    }

    .none-event {
        pointer-events: none;
    }

    .border-rect {
        stroke: #000000;
        stroke-width: 2;
        fill: none;
    }
</style>
<style scoped lang="less" src="@/assets/dot-style.less"></style>
<style scoped lang="less" src="@/assets/direct.less"></style>