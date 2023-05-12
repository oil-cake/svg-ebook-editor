<template>
    <div class="container">
        <ul class="prop-list">
            <li>x：
                <a-input-number v-model:value="func.attribute.x"/>
            </li>
            <li>y：
                <a-input-number v-model:value="func.attribute.y"/>
            </li>
            <li>宽：
                <a-input-number v-model:value="func.attribute.width"/>
            </li>
            <li>高：
                <a-input-number v-model:value="func.attribute.height"/>
            </li>
            <li>
                背景填充：
                <color-picker
                        v-model:pureColor="func.bgStyle['background-color']"
                        format="rgb"
                        shape="square"
                        useType="pure"
                />
            </li>
            <li >
                边框样式：
                <a-select
                        v-model:value="func.bgStyle['border-style']"
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
                        v-model:pureColor="func.bgStyle['border-color']"
                        format="rgb"
                        shape="square"
                        useType="pure"
                />
            </li>
            <li >
                边框宽度：
                <a-input-number v-model:value="borderWidth">
                    <template #addonAfter>px</template>
                </a-input-number>
            </li>
        </ul>
        <ul class="prop-list">
            <template v-for="(item,i) in func.param.data" :key="i">
                <li v-if="item">
                    {{item.fn}}
                    <color-picker
                            v-model:pureColor="item.color"
                            format="rgb"
                            shape="square"
                            useType="pure"
                            @change="(color)=>{
                                changeColor(item,color)
                            }"
                    />
                    <a-button danger type="primary" @click="deleteFun(item)">
                        <template #icon><delete-outlined /></template>
                        删除</a-button>
<!--                    <a-button type="primary">-->
<!--                        <template #icon><CopyOutlined /></template>-->
<!--                        修改</a-button>-->
                </li>
            </template>
            <li v-show="state" style="border: 1px white solid">
                <ul class="prop-list black-border">
                    <li>
                        函数表达式：
                        <a-textarea
                                v-model:value="tempFn.fn"
                                placeholder="此处填入函数"
                                auto-size
                        />
                    </li>
                    <li>
                        函数绘制颜色：
                        <color-picker
                                v-model:pureColor="tempFn.color"
                                format="rgb"
                                shape="square"
                                useType="pure"
                        />
                    </li>
                    <li>
                        <a-button @click="addFunData(tempFn)">添加</a-button>
                    </li>
                    <li>
                        <minus-outlined v-if="state" @click.stop="state=false"/>
                    </li>
                </ul>
            </li>
            <li v-show="!state">
                <plus-outlined @click.stop="state=true"/>
            </li>
        </ul>
    </div>
</template>


<script setup>
    import {defineComponent, ref, computed, watch, reactive, toRefs, defineProps} from 'vue';
    import "vue3-colorpicker/style.css";
    import {message} from 'ant-design-vue';
    import {ColorPicker} from "vue3-colorpicker";
    import {
        PlusOutlined,
        MinusOutlined,
    } from "@ant-design/icons-vue";
    import {nanoid} from "nanoid";

    const props = defineProps(['ele'])

    // eslint-disable-next-line vue/no-setup-props-destructure
    const func = props.ele
    const tempFun = reactive({
        state: 'false',
        tempFn: {
            fn: '',
            color: 'red',
        }
    })
    const funMap = func.fnMap
    const addFunData = () => {
        const temp = tempFun.tempFn
        if (!temp.fn) {
            message.warn('函数为空');
            return
        }
        if (funMap.has(temp.fn)) {
            message.warn('函数已存在');
            return
        }
        let f = reactive({...temp})
        funMap.set(temp.fn, nanoid())
        func.param.data.push(f)
        func.ReDraw()
    }
    const deleteFun=(item)=>{
        let d=func.param.data
        d.splice(d.indexOf(item),1)
        funMap.delete(item.fn)
        func.ReDraw()
    }
    const changeColor=(color,item)=>{
        item.color=color
        func.ReDraw()
    }
    const {
        state,
        tempFn
    } = toRefs(tempFun)
    const borderWidth=ref(parseInt(func.bgStyle?func.bgStyle['border-width']:0));
    func.bgStyle['border-width']=computed(()=>{
        return borderWidth.value?`${borderWidth.value}px`:''
    });
</script>

<style scoped lang="less">
    .container {
        width: 100%;
        height: 100%;
        padding-left: 15px;
        overflow-y: auto;

        .prop-list {
            padding: 0;
            margin: 0;
            list-style: none;
            .black-border{
                border: 1px solid grey;
                padding-left: 5px;
            }
            li {
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-top: 10px;
                margin-bottom: 10px;
            }

            .unset {
                flex-direction: unset;
            }
        }
    }

</style>