<template>
    <svg
            version="1.1"
            v-bind="svg.attribute"
            xmlns="http://www.w3.org/2000/svg"
            ref="svgRef"
            class="svg"
            v-show="svg.show"
            @mousedown.self="select"
    >
        <template v-for="item in svg.elements">
            <template v-if="!item"></template>
            <RectVue
                    v-else-if="item.type === 'rect'"
                    :key="item.attribute.id"
                    :rect="item"
            />
            <PathVue
                    v-else-if="item.type === 'path'"
                    :key="item.attribute.id"
                    :path="item"
            />
            <ImageVue
                    v-else-if="item.type === 'image'"
                    :key="item.id"
                    :image="item"
            />
            <VideoVue
                    v-else-if="item.type === 'video'"
                    :key="item.id"
                    :video="item"
            />
            <RichTextVue
                    v-else-if="item.type === 'richText'"
                    :key="item.attribute.id"
                    :rich-text="item"
            />
            <BoardVue
                    v-else-if="item.type === 'board'"
                    :key="item.attribute.id"
                    :board="item"
            />
            <NoteVue
                    v-else-if="item.type === 'note'"
                    :key="item.attribute.id"
                    :note="item"
            />
            <FormulaVue
                    v-else-if="item.type === 'formula'"
                    :key="item.attribute.id"
                    :formula="item"
            />
            <FunctionVue
                    v-else-if="item.type === 'function'"
                    :key="item.attribute.id"
                    :func="item"
            />
            <PolygonVue
                    v-else-if="item.type === 'polygon'"
                    :key="item.attribute.id"
                    :polygon="item"
            />
            <PolylineVue
                    v-else-if="item.type === 'polyline'"
                    :key="item.attribute.id"
                    :polyline="item"
            />
            <CircleVue
                    v-else-if="item.type === 'circle'"
                    :key="item.attribute.id"
                    :circle="item"
            />
            <AudioVue
                    v-else-if="item.type === 'audio'"
                    :key="item.attribute.id"
                    :audio="item"
            />
        </template>
        <CanvasVue v-if="svg.board_able && svg.board" :board="svg.board"/>
    </svg>

    <div class="comment no-events"
         v-show="svg.show"
    >
        <a-drawer
                v-model:visible="commentDrawer"
                class="auto-events"
                title="评论"
                placement="right"
        >
            <div>
                <template v-if="!svg.comments_able"> 评论已关闭</template>
                <template v-else-if="svg.comments && svg.comments.length">
                    <a-comment
                            v-for="item in svg.comments"
                            :key="item.id"
                            class="parent-box-pointer comment-box"
                    >
                        <template #author>
                            <a>{{ item.user_name }}</a>
                        </template>
                        <template #content>
                            <p>
                                {{ item.comment_details }}
                            </p>
                        </template>
                        <template #actions>
              <span @click="replyComment(item)"
              >回复{{
                  item.reply_list && item.reply_list.length
                    ? "(" + item.reply_list.length + ")"
                    : ""
                }}</span
              >
                            <span @click="foldComment($event)">折叠</span>
                            <span @click="expandComment($event)">展开</span>
                        </template>
                        <template v-if="item.reply_list && item.reply_list.length">
                            <div class="transition bc fold">
                                <a-comment
                                        v-for="it in item.reply_list"
                                        :key="it.id"
                                        class="comment-box"
                                >
                                    <template #actions>
                                        <span>回复</span>
                                    </template>
                                    <template #author>
                                        <a>{{ it.user_name }}</a>
                                    </template>
                                    <template #content>
                                        <p>
                                            {{ it.comment_details }}
                                        </p>
                                    </template>
                                </a-comment>
                            </div>
                        </template>
                    </a-comment>
                    <div style="height: 100px; color: #9499a0">没有更多评论了</div>
                </template>
                <template v-else> 暂无评论</template>
            </div>
            <div class="ab comment-input" v-if="svg.comments_able">
                <a-textarea
                        v-model:value="contentComment"
                        placeholder="在此输入评论"
                        auto-size
                />
                <div style="height: 10px"></div>
                <a-button @click="leaveComment" type="primary">发表</a-button>
            </div>
        </a-drawer>
        <div class="auto-events" title="评论">
            <message-outlined @click="showDrawer"/>
        </div>
    </div>
</template>

<script setup>
    import {
        inject,
        watch,
        ref,
        onMounted,
        computed,
        reactive,
        defineProps,
        defineComponent,
        toRefs,
        defineExpose,
    } from "vue";
    import {Comment} from "@/model/comment";
    import _ from "lodash";
    import RectVue from "../rect/RectVue.vue";
    import ImageVue from "@/components/image/ImageVue.vue";
    import VideoVue from "@/components/video/VideoVue.vue";
    import RichTextVue from "@/components/richtext/RichTextVue.vue";
    import BoardVue from "@/components/board/BoardVue.vue";
    import CanvasVue from "@/components/canvas/CanvasVue";
    import PathVue from "@/components/path/PathVue";
    import NoteVue from "@/components/note/NoteVue";
    import FormulaVue from "@/components/formula/FormulaVue";
    import FunctionVue from "@/components/function/FunctionVue";
    import PolygonVue from "@/components/polygon/PolygonVue";
    import PolylineVue from "@/components/polyline/PolylineVue";
    import CircleVue from "@/components/circle/CircleVue";
    import AudioVue from "@/components/audio/AudioVue";
    import {message} from "ant-design-vue";

    import {MessageOutlined} from "@ant-design/icons-vue";
    import $ from "jquery";
    import {SvgBoard} from "@/model/Shape";
    import {nanoid} from "nanoid";

    // const props = defineProps(["svgList", "current"]);
    const props = defineProps(["svg"]);
    const getHandler = inject("getHandler");

    let propVue = getHandler("propVue", (h) => {
        propVue = h;
    });
    let handlerVue = getHandler("handlerVue", (h) => {
        handlerVue = h;
    });
    // eslint-disable-next-line vue/no-setup-props-destructure
    const svg = props.svg;
    svg.show=false
    const svgRef = ref(null)

    const select = () => {
        propVue.setElement(svg);
    };
    const user = reactive({
        user_id: nanoid(),
        user_name: "才能赛",
    });
    const contentComment = ref();
    const leaveComment = () => {
        let s = contentComment.value.replace(/\s*/g, "").replace(/[\r\n]/g, "");
        if (_.isEmpty(s)) {
            message.warn("评论不能为空");
            return;
        }
        let content = {
            content_id: svg.attribute.id,
        };
        let comment = Comment.newContentComment(content, user);
        comment.comment_details = contentComment.value.trim();
        svg.comments.push(comment);
        message.success("评论成功");
        contentComment.value = "";
    };
    const replyComment = (comment) => {
        let reply_comment = Comment.newReplyComment(comment, user);
        reply_comment.comment_details = "蒸乌鱼";
        comment.reply_list.push(reply_comment);
    };
    const commentDrawer = ref(false);
    const showDrawer = () => {
        commentDrawer.value = true;
    };
    const foldComment = (e) => {
        let $e = $(e.target);
        let p = $e.parents(".parent-box-pointer");
        console.log(e, $e, p);
        p.addClass("parent-box");
    };
    const expandComment = (e) => {
        let $e = $(e.target);
        $e.parents(".parent-box-pointer").removeClass("parent-box");
    };
    defineExpose({svgRef})
    onMounted(() => {
        svg.svgRef = svgRef.value
        svg.scale = 100
    })
    svg.SETBOARD = () => {
        if (!svg.board_able && svg.board) {
            svg.board = null
            return
        }
        svg.board = computed(() => {
            const b = SvgBoard.copy()
            b.attribute.width = svg.attribute.width
            b.attribute.height = svg.attribute.height
            b.bgStyle = reactive({
                'background-color': 'transparent',
                'border-style': 'none',
            })
            return b
        })
    }
    svg.SETBOARD()
    svg.SETCOMMENT = () => {
        if (!svg.comments_able) {
            svg.comments_able = null

        } else {
            svg.comments = []
        }
    }
    svg.SETCOMMENT()
    svg.SAVEFUN = (zip, taskSet) => {
        let ans = _.omit(svg, ['elements', 'attribute', 'SAVEFUN', 'SETBOARD', 'SETCOMMENT','svgRef','show'])
        ans.attribute = _.omit(svg.attribute, ['style'])
        ans.attribute.style = _.pick(svg.attribute.style, ['background-color'])
        ans.elements = []
        svg.elements.forEach((it) => {
            if (it.SAVEFUN) {
                ans.elements.push(it.SAVEFUN(zip, taskSet))
            } else {
                ans.elements.push(it)
            }
        })
        if (svg.board_able){
            ans.board=svg.board.SAVEFUN(zip, taskSet)
        }
        return ans
    }
</script>

<style lang="less" scoped>
    .svg {
        position: absolute;
        box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.1);
        /*display: none; //一开始应该时隐藏的*/
        margin: 0 auto;
    }

    .comment {
        position: absolute;
        bottom: 40px;
        right: 0px;
        left: 0px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        justify-items: center;
    }

    .box {
        max-width: 500px;
        max-height: 600px;
        overflow-y: auto;
    }

    .no-events {
        pointer-events: none !important;
    }

    .re {
        position: relative;
    }

    .ab {
        position: absolute;
    }

    .comment-box {
        border-top: white dashed 2px;
    }

    .auto-events {
        pointer-events: auto !important;
    }

    .transition {
        transition-property: all;
        transition-duration: 1s;
        transition-timing-function: linear;
    }

    .comment-input {
        background-color: white;
        bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;
        left: 0;
        right: 0;
    }

    .bc {
        background-color: rgb(66 70 67 / 8%);
    }

    .parent-box {
        .fold {
            /*height: 0;*/
            display: none;
        }
    }

    .parent-box-pointer {
    }
</style>
