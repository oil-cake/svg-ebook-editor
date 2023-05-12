<template>
        <div  v-for="(value, key) in idMap.editors" :key="key" :id="key" v-showone="key">
            <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="value.editor"
                    :defaultConfig="toolbarConfig"
                    :mode="mode"
            />
        </div>

</template>

<script setup>
    import '@wangeditor/editor/dist/css/style.css' // 引入 css
    import {defineComponent, watch, shallowRef, onMounted, inject,reactive,defineProps} from 'vue'
    import { Toolbar } from '@wangeditor/editor-for-vue'
    import {nanoid} from "nanoid";
    import $ from "jquery";
    const toolbarConfig = {}
    const mode= 'default'
    const addHandler = inject("addHandler");
    const idMap=reactive({
        selectKey:null,
        editors:reactive({}) ,
        eles:{},
    })
    const map=new Map()
    const setRichTextEditor=(editor)=>{
        if (!map.has(editor)){
            let obj={
                key:nanoid(),
                editor:editor,
            }
            map.set(editor,obj)
            idMap.editors[obj.key]=obj
        }
        showRichTextEditor(map.get(editor).key)
    }
    const cancelRichTextEditor=(editor)=>{
        const key=map.get(editor).key
        if (idMap.selectKey===key){
            showRichTextEditor(null)
        }
    }
    const showRichTextEditor=(key)=>{
        if (idMap.selectKey&&idMap.selectKey!==key){
            if (idMap.eles[idMap.selectKey]){
                $(idMap.eles[idMap.selectKey]).hide()
            }
        }
        if (key&&idMap.eles[key]){
            $(idMap.eles[key]).show()
        }
        idMap.selectKey=key
    }
    const addRichTextEditor=(el,key)=>{
        idMap.eles[key]=el
        if (idMap.selectKey===key){
            showRichTextEditor(key)
        }
    }
    addHandler('setRichTextEditor',setRichTextEditor)
    addHandler('cancelRichTextEditor',cancelRichTextEditor)

    const vShowone= {
        mounted(el, binding) {
            const key = binding.value
            addRichTextEditor(el,key)
        }
    }
</script>

<style lang="less" scoped>
    .hide{
        display: none;
    }
</style>