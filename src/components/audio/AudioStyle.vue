<template>
    <div class="container">
        <ul class="prop-list">
            <li>
                x：
                <a-input-number v-model:value="audio.attribute.x"/>
            </li>
            <li>
                y：
                <a-input-number v-model:value="audio.attribute.y"/>
            </li>
            <li>
                标题：
                <a-input v-model:value="audio.title"></a-input>
            </li>
            <li>
                <upload-vue :options="op" @ChangeFile="getFile">
                    <a-button>上传音频</a-button>
                </upload-vue>

            </li>
        </ul>
    </div>
</template>
<script setup>
    import {
        defineComponent,
        ref,
        computed,
        watch,
        reactive,
        defineProps, inject,
    } from "vue";
    import "vue3-colorpicker/style.css";
    import {ColorPicker} from "vue3-colorpicker";
    import {nanoid} from "nanoid";
    import UploadVue from "@/components/upload/UploadVue.vue";

    const props = defineProps(["ele"]);
    // eslint-disable-next-line vue/no-setup-props-destructure
    const audio = props.ele;
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

</script>

<style scoped lang="less">
    .container {
        width: 100%;
        height: 100%;
        padding-left: 20px;

        .prop-list {
            padding: 0;
            margin: 0;
            list-style: none;

            li {
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-top: 10px;
                margin-bottom: 10px;
            }
        }
    }
</style>
