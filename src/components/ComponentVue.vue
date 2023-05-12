<template>
    <div class="ct-top"
         :class="{'no-event':!fold}"
    >
        <div class="btn-container auto-event">
            <div class="transition btn-ct">
                <div class="btn transition normal left" :class="{'left-fold':fold,'left-hide':hide}"
                     @click="fold=!fold">
                    <RightOutlined v-if="fold"/>
                    <LeftOutlined v-else/>
                </div>
                <div class="btn transition normal right"
                     :class="{'right-fold':fold,'right-hide':hide,'auto-event':hide}"
                     @click="hide?(fold=hide=false):hide=fold=true">
                    <RightOutlined v-if="hide"/>
                    <MinusOutlined v-if="!hide"/>
                </div>
            </div>
        </div>
        <div class="re transition" :class="{'fold':fold,'unfold':!fold,'unhide':!hide,'hide':hide}">
            <div class="test ab transition auto-event" v-for="i in ele" :style="fold?pos1[i]:pos2[i]" :key="i">
                <ArrowMenuItem v-if="i==0"/>
                <RectMenuItem v-else-if="i==1"/>
                <PathMenuItem v-else-if="i==2"/>
                <RichtextMenuItem v-else-if="i==3"/>
                <ImageMenuItem v-else-if="i==4"/>
                <VideoMenuItem v-else-if="i==5"/>
                <BoardMenuItem v-else-if="i==6"/>
                <HandMenuItem v-else-if="i==7"/>
                <ScaleMenuItem v-else-if="i==8"/>
                <NoteMenuItem v-else-if="i==9"/>
                <FormulaMenuItem v-else-if="i==10"/>
                <FunctionMenuItem v-else-if="i==11"/>
                <PolygonMenuItem v-else-if="i==12"/>
                <CircleMenuItem v-else-if="i==13"/>
                <PolylineMenuItem v-else-if="i==14"/>
                <AudioMenuItem v-else-if="i==15"/>
            </div>
        </div>
    </div>
</template>

<script setup>

    import {defineComponent, ref, onMounted, reactive, inject} from 'vue';
    import RichtextMenuItem from "@/components/richtext/RichtextMenuItem";
    import BoardMenuItem from "@/components/board/BoardMenuItem";
    import ArrowMenuItem from "./arrow/ArrowMenuItem.vue"
    import RectMenuItem from "./rect/RectMenuItem.vue"
    import ImageMenuItem from "@/components/image/ImageMenuItem";
    import VideoMenuItem from "@/components/video/VideoMenuItem";
    import PathMenuItem from "@/components/path/PathMenuItem";
    import HandMenuItem from "@/components/hand/HandMenuItem";
    import ScaleMenuItem from "@/components/scale/ScaleMenuItem";
    import NoteMenuItem from "@/components/note/NoteMenuItem";
    import FormulaMenuItem from "@/components/formula/FormulaMenuItem";
    import FunctionMenuItem from "@/components/function/FunctionMenuItem";
    import PolygonMenuItem from "@/components/polygon/PolygonMenuItem";
    import PolylineMenuItem from "@/components/polyline/PolylineMenuItem";
    import CircleMenuItem from "@/components/circle/CircleMenuItem";
    import AudioMenuItem from "@/components/audio/AudioMenuItem";
    import {
        LeftOutlined,
        RightOutlined,
        MinusOutlined,
    } from "@ant-design/icons-vue";
    import {nanoid} from 'nanoid'
    import $ from 'jquery';

    const fold = ref(false)
    const ele = []
    const pos1 = []
    const pos2 = []
    const sum = 16
    for (let i = 0; i < sum; i++) {
        ele.push(i)
        pos1.push({left: 0 + 'px', top: i * 90 + 'px'})
        let d = Math.floor(i % 3)
        let k = Math.floor(i / 3)
        pos2.push({left: d * 80 + 'px', top: k * 80 + 'px'})
    }

    const componentVue = reactive({
        select: '',
    })
    const addHandler = inject("addHandler");
    addHandler('componentVue', componentVue)

    const hide = ref(false);

</script>

<style lang="less" scoped>
    .btn-container {
        position: relative;
        height: 50px;

        .btn-ct {
            position: absolute;
        }

        .btn-ct-fold {
            left: -150px;
        }

        .btn-ct-unfold {
            left: 0;
        }

        .btn {
            position: absolute;
            top: 0;
            height: 50px;
            width: 50px;
            font-size: 28px;
            text-align: center;
            border-radius: 50%;
            background-color: rgba(66, 60, 67, 0.1);

            &:hover {
                color: #ffffff;
                background-color: rgba(66, 60, 67, 0.4);
            }
        }

        .left {
            left: 95px;
        }

        .left-fold {
            left: 0;
        }

        .left-hide {
            left: -50px;
        }

        .right {
            left: 190px;
        }

        .right-fold {
            left: 65px;
        }

        .right-hide {
            left: 0;
        }
    }

    .ct-top {
        position: absolute;
        width: fit-content;
    }

    .transition {
        transition-property: all;
        transition-duration: .5s;
        transition-timing-function: linear;
    }


    .fold {
        width: 110px;
        height: 600px;
        overflow: auto;

        .test {
            width: 90px;
            height: 90px;
        }
    }

    .unfold {
        width: 240px;
        height: 600px;
        overflow: auto;

        .test {
            width: 80px;
            height: 80px;
        }
    }

    .hide {
        left: -300px;
    }

    .unhide {
        left: 0;
    }

    .ab {
        position: absolute;
    }

    .re {
        position: relative;
    }

    .no-event {
        pointer-events: none !important;
    }

    .auto-event {
        pointer-events: auto !important;
    }
</style>