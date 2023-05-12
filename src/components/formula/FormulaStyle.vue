<template>
    <div class="container">
        <ul class="prop-list">
            <li>
                x：
                <a-input-number v-model:value="formula.attribute.x"/>
            </li>
            <li>
                y：
                <a-input-number v-model:value="formula.attribute.y"/>
            </li>
            <li>
                宽：
                <a-input-number v-model:value="formula.attribute.width">
                    <template #addonAfter>px</template>
                </a-input-number>
            </li>
            <li>
                高：
                <a-input-number v-model:value="formula.attribute.height">
                    <template #addonAfter>px</template>
                </a-input-number>
            </li>
            <li style="border: white 2px solid">
                <ul class="prop-list">
                    <li>表达式：</li>
                    <li style="word-break: break-all">
                        <!--                        <div >-->
                        {{ formula.expression }}
                        <!--                        </div>-->
                    </li>
                    <li>
                        <a-button @click="showModal(true)">修改</a-button>
                        <a-modal
                                ok-text="确认"
                                cancel-text="取消"
                                @ok="onOk"
                                :maskClosable="false"
                                :z-index="100"
                                v-model:visible="visible"
                                title="修改公式"
                        >
                            <math-field
                                    ref="formulaRef"
                                    virtual-keyboard-mode="manual"
                                    style="padding: 1px; margin: 10px"
                            >{{ formula_temp }}
                            </math-field>
                        </a-modal>
                    </li>
                </ul>
            </li>
            <li>
                背景填充：
                <color-picker
                        v-model:pureColor="formula.bgStyle['background-color']"
                        format="rgb"
                        shape="square"
                        useType="pure"
                />
            </li>
            <li>
                边框样式：
                <a-select
                        v-model:value="formula.bgStyle['border-style']"
                >
                    <a-select-option value="none">无边框</a-select-option>
                    <a-select-option value="solid">实线边框</a-select-option>
                    <a-select-option value="dashed">虚线边框</a-select-option>
                    <a-select-option value="dotted">点线边框</a-select-option>
                </a-select>
            </li>
            <li>
                边框颜色：
                <color-picker
                        v-model:pureColor="formula.bgStyle['border-color']"
                        format="rgb"
                        shape="square"
                        useType="pure"
                />
            </li>
            <li>
                边框宽度：
                <a-input-number v-model:value="borderWidth">
                    <template #addonAfter>px</template>
                </a-input-number>
            </li>
            <li>
                字体颜色：
                <color-picker
                        v-model:pureColor="formula.bgStyle['color']"
                        format="rgb"
                        shape="square"
                        useType="pure"
                />
            </li>
            <li>
                字体大小：
                <a-input-number v-model:value="formula.fontSize">
                    <template #addonAfter>px</template>
                </a-input-number>
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
        defineProps,
    } from "vue";
    import {ColorPicker} from "vue3-colorpicker";
    import "vue3-colorpicker/style.css";
    import {VueLatex} from "vatex";
    import {MathfieldElement} from "mathlive";

    import("mathlive");

    const props = defineProps(["ele"]);

    // eslint-disable-next-line vue/no-setup-props-destructure
    const formula = props.ele;
    const formulaRef = ref(null);
    const formula_temp = ref();


    const borderWidth = ref(parseInt(formula.bgStyle['border-width']));
    formula.bgStyle['border-width'] = computed(() => {
        return borderWidth.value ? `${borderWidth.value}px` : ''
    });

    const showModal = (val) => {
        formula_temp.value = formula.expression;
        visible.value = val;
    };
    const onOk = () => {
        formula.expression = formulaRef.value.value + "";
        showModal(false);
    };
    const visible = ref(false);
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
