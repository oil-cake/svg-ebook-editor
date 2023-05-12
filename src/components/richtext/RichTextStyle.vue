<template>
    <div class="pl">
        <div class="pl-sub">x：
            <a-input-number v-model:value="richText.attribute.x"/>
        </div>
        <div class="pl-sub">y：
            <a-input-number v-model:value="richText.attribute.y"/>
        </div>
        <div class="pl-sub">宽：
            <a-input-number v-model:value="richText.attribute.width"/>
        </div>
        <div class="pl-sub">高：
            <a-input-number v-model:value="richText.attribute.height"/>
        </div>
        <div class="pl-sub">
            背景填充：
            <color-picker
                    v-model:pureColor="richText.container['background-color']"
                    format="rgb"
                    shape="square"
                    useType="pure"
            />

        </div>
        <div class="pl-sub">
            字体颜色：
            <color-picker
                    v-model:pureColor="richText.container['--w-e-textarea-color']"
                    format="rgb"
                    shape="square"
                    useType="pure"
            />

        </div>
        <div class="pl-sub">
            边框样式：
            <a-select
                    v-model:value="richText.container['border-style']"
            >
                <a-select-option value="none">无边框</a-select-option>
                <a-select-option value="solid">实线边框</a-select-option>
                <a-select-option value="dashed">虚线边框</a-select-option>
                <a-select-option value="dotted">点线边框</a-select-option>
            </a-select>
        </div>
        <div class="pl-sub">
            边框颜色：
            <color-picker
                    v-model:pureColor="richText.container['border-color']"
                    format="rgb"
                    shape="square"
                    useType="pure"
            />
        </div>
        <div class="pl-sub">
            边框宽度：
            <a-input-number v-model:value="borderWidth">
                <template #addonAfter>px</template>
            </a-input-number>

        </div>
        <div class="pl-sub">圆角：
            <a-input-number v-model:value="borderRadius"/>
        </div>
        <div class="pl-sub">旋转角度：
            <a-input-number v-model:value="richText.rotateAngle"/>
        </div>
    </div>
</template>
<script setup>
    import {defineComponent, ref, computed, watch, reactive, toRefs, defineProps} from 'vue';
    import "vue3-colorpicker/style.css";
    import {ColorPicker} from "vue3-colorpicker";

 // 引入样式文件

    const props = defineProps(['ele'])
    // eslint-disable-next-line vue/no-setup-props-destructure
    const richText = props.ele
    const borderWidth=ref(parseInt(richText.container['border-width']))
    richText.container['border-width']=computed(()=>{
        return `${borderWidth.value}px`
    })
    const borderRadius = ref(parseInt(richText.container['border-radius']))
    richText.container['border-radius']=computed(()=>{
        return `${borderRadius.value}px`
    })
</script>

<style scoped lang="less" src="@/assets/comp_style.less">
.b{

}
</style>