<template>
    <div class="bg" v-if="!svgList||svgList.length<=0">
        <div class="menu-bar z-index-high">
            <div class="bar">
                <a-dropdown :trigger="['click']">
                    <a-button shape="round" type="text" ghost>
                        <template #icon>
                            <MenuOutlined/>
                        </template>
                        选项
                    </a-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="newEbookDialog=true">
                                <a>新建电子书</a>
                            </a-menu-item>
                            <a-menu-item @click="openBtnRef.click()">
                                <a>编辑电子书</a>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
                <a-dropdown :trigger="['click']">
                    <a-button shape="round" type="text">
                        <template #icon>
                            <MenuOutlined/>
                        </template>
                        帮助
                    </a-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item>
                                <a>关于</a>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </div>
        <div class="z-index-low create-panel">
            <div class="item" @click="newEbookDialog=true">
                <FileAddOutlined/>
                新建电子书
            </div>
            <a-modal v-model:visible="newEbookDialog"
                     title="新建参数"
                     @ok="newEbook"
                     ok-text="确认"
                     cancel-text="取消">
                <p>宽度：
                    <a-input-number v-model:value="EbookTemplate.width"/>
                </p>
                <p>高度：
                    <a-input-number v-model:value="EbookTemplate.height"/>
                </p>
                <p>页数：
                    <a-input-number v-model:value="EbookTemplate.pages" :min="1"/>
                </p>
            </a-modal>
            <div class="item" @click="openBtnRef.click()">
                <FileOutlined/>
                编辑电子书
                <input type="file" hidden ref="openBtnRef" @change="openFile" accept="*/ebook"/>
            </div>
        </div>
        <div style="margin-top: 100px;z-index: 10;width: 100px">
<!--            <aplayer music="https://www.runoob.com/try/demo_source/horse.mp3" :mini="true"></aplayer>-->
<!--            <vue-audio file="https://www.runoob.com/try/demo_source/horse.mp3"></vue-audio>-->
        </div>
    </div>
    <div class="bg" v-if="svgList&&svgList.length>0">
        <div class="menu-bar z-index-high">
            <div class="bar">
                <a-dropdown :trigger="['click']">
                    <a-button shape="round" type="text" ghost>
                        <template #icon>
                            <MenuOutlined/>
                        </template>
                        选项
                    </a-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="saveZipFile">
                                <a href="javascript:">保存该电子书</a>
                            </a-menu-item>
                            <a-menu-item>
                                <a href="javascript:">其他</a>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
                <a-dropdown :trigger="['click']">
                    <a-button shape="round" type="text">
                        <template #icon>
                            <MenuOutlined/>
                        </template>
                        帮助
                    </a-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item>
                                <a>关于</a>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
            <div class="toolbar">
                <tool-vue/>
            </div>
        </div>
        <div class="component-bar z-index-high">
            <ComponentVue/>
        </div>
        <div class="prop-bar z-index-high">
            <PropVue/>
        </div>
        <div class="z-index-low">
            <HandlerVue :svgs="svgList"/>
        </div>
    </div>
    <div class="bg z-index-highest center-loading-msg" v-if="loading.value">
        <LoadingOutlined/>
    </div>

</template>

<script setup>
    import { message } from 'ant-design-vue';
    import {
        FileAddOutlined,
        FileOutlined,
        LoadingOutlined,
    } from "@ant-design/icons-vue";
    import {defineComponent, ref, reactive, provide, onMounted, watch, shallowRef, withDirectives, computed} from "vue";
    import PropVue from "@/components/PropVue";
    import ToolVue from "@/components/ToolVue";
    import HandlerVue from "@/components/handler/HandlerVue";
    import {Svg, clone} from "../model/Shape"
    import ComponentVue from "@/components/ComponentVue";
    import $ from 'jquery';
    import _ from "lodash";
    import JSZip from 'jszip';
    import {saveAs} from 'file-saver'

    const dataMap = reactive({})
    const svgList = ref(null)
    const newEbookDialog = ref(false)
    const EbookTemplate = reactive({
        width: 500,
        height: 800,
        pages: 1,
    })

    //映射表
    const handlerMap = reactive({})
    //等待列表
    const getHandlerObj = (key) => {
        let t = handlerMap[key]
        if (!t) {
            t = handlerMap[key] = reactive({
                handler: null,
                wait: [],
            })
            const applyFun = (handler, wait) => {
                if (!handler || wait.length <= 0) return
                wait.forEach(function (it, index, self) {
                    it(handler)
                })
                wait.length = 0
            }
            const listener = () => {
                applyFun(t.handler, t.wait)
            }
            watch(() => t.handler, listener)
            watch(() => t.wait, listener, {immediate: true, deep: true})
        }
        return t
    }
    const addHandler = (key, item) => {
        let t = getHandlerObj(key)
        t.handler = item
    }
    const getHandler = (key, func) => {
        //如果没有那就进入等待列表
        let t = getHandlerObj(key)
        if (t.handler) return t.handler
        t.wait.push(func)
        return null
    }
    provide('addHandler', addHandler)
    provide('getHandler', getHandler)
    addHandler('dataMap', dataMap)

    const loading=reactive({value:false})
    const saveZipFile = () => {
        const taskSet = new Set();
        let res = []
        let zip = new JSZip();
        svgList.value.forEach((item) => {
            let ans = item.SAVEFUN(zip,taskSet)
            res.push(ans)
        })
        let content = JSON.stringify(res);
        zip.file('book.json', content, {comment: 'json'});

        function waitForCondition(conditionFn) {
            return new Promise(resolve => {
                const intervalId = setInterval(() => {
                    if (conditionFn()) {
                        clearInterval(intervalId);
                        resolve();
                    }
                }, 100); // 每隔100毫秒检查一次条件
            });
        }
        // 使用等待函数
        async function myFunction() {
            console.log('start');
            loading.value=true
            await waitForCondition(() => {
                // 条件判断语句
                return taskSet.size <=0;
            })
            console.log('After condition is met');
            // 继续执行代码...
            zip.generateAsync({type: 'blob'}).then((blob) => {
                saveAs(blob, '未命名.ebook');
                loading.value=false
            }).then(()=>{
                message.success('保存成功')
            });
        }

        myFunction()

    }
    const newEbook = () => {
        loading.value=true
        let arr = Svg.newSvgList(EbookTemplate.width, EbookTemplate.height, EbookTemplate.pages)
        svgList.value = arr
        newEbookDialog.value = false
        loading.value=false
    }
    const openBtnRef = ref(null)
    const openFile = (e) => {
        loading.value=true
        let reader = new FileReader();
        const jsZip = new JSZip();
        reader.onload = async (event) => {
            // 解析 ArrayBuffer 数据
            const buffer = event.target.result;
            const loadPromise = new Promise((resolve, reject) => {
                jsZip.loadAsync(buffer).then(zip => {
                    function readZipFileAsync(filename, type) {
                        return zip.file(filename).async(type)
                    }

                    addHandler('readZipFileAsync', readZipFileAsync)
                }).then(() => {
                    resolve()
                })
            }).then(() => {
                //获取书本
                const readZipFileAsync = getHandler('readZipFileAsync');
                readZipFileAsync('book.json', 'string').then(function (content) {
                    let ans = clone(JSON.parse(content))
                    dataMap['book'] = ans
                    svgList.value = ans
                    loading.value=false
                    message.success('打开成功')
                })
            })


        };
        reader.readAsArrayBuffer(e.target.files[0]);
    }
</script>

<style scoped lang="less">

    .z-index-high {
        z-index: 3;
    }

    .z-index-low {
        z-index: 1;
    }
    .z-index-highest{
        z-index: 5;
    }

    .bg {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        overflow: hidden;
    }
    .center-loading-msg{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 60px;
        background-color: rgba(119,125,128,0.7);
    }

    .create-panel {
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .item {
            font-size: 24px;
            color: rgba(39, 43, 40, 0.3);
            padding: 10px 0 10px 0;
            border-bottom: transparent 2px solid;

            &:hover {
                color: rgba(39, 43, 40, 0.6);
                border-bottom: rgba(39, 43, 40, 0.6) 2px solid;
            }
        }
    }

    .menu-bar {
        top: 0;
        right: 0;
        left: 0;
        position: absolute;

        .bar {
            background-color: whitesmoke;
            padding: 10px 20px 10px 20px;
            display: flex;
            flex-direction: row;
            box-shadow: 0px 0px 0px 3px rgba(110, 116, 119, 0.19);
        }
    }

    .component-bar {
        position: relative;
        left: 0;
        top: 100px;
        width: fit-content;
    }

    .prop-bar {
        position: absolute;
        top: 100px;
        right: 0;
    }

    .right-bar {
        position: absolute;
        right: 0;
        top: 100px;
        height: 600px;
        width: 20px;
        background-color: #6e7477;
        overflow-x: hidden;
    }

</style>
