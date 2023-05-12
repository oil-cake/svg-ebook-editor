<template>
    <foreignObject v-bind="audio.attribute" >

        <a-popover trigger="click">
            <template #title>
                <div v-text="audio.title?audio.title:'无标题'"></div>
            </template>
            <template #content>
                <div v-if="audio.src_id&&audio.src" class="audio-box">
                    <vue-audio :file="audio.src" />
                </div>
                <div v-else>
                    <upload-vue :options="op" @ChangeFile="getFile">
                        <a>点击上传音频</a>
                    </upload-vue>
                </div>
            </template>
            <div :title="audio.title" class="container" v-dot="'move'" ref="btn" @mousedown="select">
                <ControlOutlined />
            </div>
        </a-popover>
    </foreignObject>

</template>

<script setup>
    import {defineProps, inject, reactive, ref} from 'vue';
    import UploadVue from "@/components/upload/UploadVue.vue";
    import {
        ControlOutlined,
        PlayCircleFilled,
        PauseCircleFilled,
    } from "@ant-design/icons-vue";
    import VueAudio from 'vue-audio';
    import _ from "lodash";
    import $ from "jquery";
    import {nanoid} from "nanoid";
    import {clone} from "@/model/Shape";
    const props=defineProps(['audio'])
    // eslint-disable-next-line vue/no-setup-props-destructure
    const audio=props.audio
    const op = {
        accept: "audio/*",
    };
    const getHandler = inject('getHandler')
    let dataMap = getHandler("dataMap", (h) => {
        dataMap = h;
    });
    const getFile = (files) => {
        let file = files[0];
        let reader = new FileReader();
        let url = URL.createObjectURL(file)
        reader.onload = function (event) {
            audio.src_id = nanoid()
            dataMap[audio.src_id] = event.target.result
            audio.src = url
            audio.title=file.name
        };
        reader.readAsArrayBuffer(file);
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
    const readZipFileAsync = getHandler('readZipFileAsync');
    if (audio.src_id) {
        if (dataMap[audio.src_id]) {
            audio.src = URL.createObjectURL(new Blob([dataMap[audio.src_id]]));
        } else {
            readZipFileAsync(audio.src_id, 'uint8array').then((content) => {
                dataMap[audio.src_id] = content
                audio.src = URL.createObjectURL(new Blob([dataMap[audio.src_id]]));
            })
        }
    }
    const hasMove=ref(false)
    const btn=ref(null)
    const mousedown = function (e, type) {
        let ele = audio
        let oldAttr = {...ele.attribute}
        let mdXY = svgVue.clientToOffset(e.clientX, e.clientY)
        const setAttr = (e, type) => {
            if (!ele) return
            let xy = svgVue.clientToOffset(e.clientX, e.clientY)
            switch (type) {
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
                        hasMove.value=true
                        if (!ele && e.target != handlerVue.containRef) return
                        setAttr(e, type)
                    }, 100),
                    useCapture: false
                }
            ],
            mouseup: [
                {
                    function: function (e) {
                        if (!hasMove.value){
                            resetType()
                            btn.value.click()
                            return;
                        }
                        if (!ele && e.target != handlerVue.containRef) return
                        setAttr(e, type)
                        ele = null
                        hasMove.value=false
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
    const select = () => {
        propVue.setElement(audio);
    };
    audio.COPY=()=>{
        let copy = _.omit(audio, ['SAVEFUN','COPY'])
        copy=clone(copy)
        copy.attribute.id=nanoid()
        return copy
    }
    audio.SAVEFUN = (zip, taskSet) => {
        const taskId = nanoid()
        taskSet.add(taskId)
        const save = _.omit(audio, ['SAVEFUN','COPY'])
        if (!save.src_id)
            return save
        save.src = ''
        zip.file(save.src_id, dataMap[save.src_id], {binary: true, comment: 'audio'});
        taskSet.delete(taskId)
        return save
    }
</script>

<style lang="less" scoped>
    .container{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        justify-items: center;
        justify-content: center;
        align-items: center;
        &:hover{
            background-color: #cccccc;
            color: white;
        }
    }
    .audio-box{
        display: flex;
        flex-direction: row;
    }
    .audio-box-widget{
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        &:active{
            color:lightblue;
            font-size: 20px;
            font-weight: bold;
        }
    }
    .audio-box-widget-unset-width{
        padding: 0 5px 0 5px;
        height: 30px;
    }
    .t{
        width: 150px;
        height: 30px;
    }
</style>