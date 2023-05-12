<template>
    <input ref="input" type="file" style="display: none" v-bind="options" @change="CallChangeFile" >
    <div @click="ShowFileSelect" class="uploader">
        <slot>

        </slot>
    </div>
</template>

<script lang="js">
    import {defineComponent,ref} from 'vue';
    export default defineComponent({
        name: "UploadVue",
        props:['options'],
        emits:['ChangeFile'],
        setup(props,ctx){
            const input=ref(null);
            const ShowFileSelect=()=>{
                if (input.value){
                    input.value.click();
                }
            }
            const CallChangeFile=(e)=>{
                ctx.emit('ChangeFile',e.target.files);
            }
            return{
                ShowFileSelect,
                CallChangeFile,
                input,
            }
        },
    })
</script>

<style lang="less" scoped>
</style>