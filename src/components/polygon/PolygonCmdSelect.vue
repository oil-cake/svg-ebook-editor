<template>
  <span
    class="fix pos"
    :style="xyStyle"
    v-text="xyText"
    v-if="xyTextShow"
  ></span>
  <div class="fix pos dot-div-gray circle" v-if="xyTextShow" :style="xyDivStyle"></div>
  <div class="fix bg" v-show="menuVisible">
    <a-dropdown
      :trigger="['click']"
      v-model:visible="visible"
      @visibleChange="handleVisible"
    >
      <div ref="menuRef" class="ab m" :style="menuStyle"></div>
      <template #overlay>
        <a-menu @click="keyClick">
          <a-menu-item key="continue">继续绘制</a-menu-item>
          <a-menu-item key="quit">完成绘制</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup>
import {
  defineComponent,
  inject,
  onMounted,
  reactive,
  ref,
  watch,
  toRefs,
} from "vue";
import $ from "jquery";

const visible = ref(false);
const addHandler = inject("addHandler");
const xyPos = reactive({
  xy: reactive({ x: 0, y: 0 }),
  xyStyle: reactive({ left: 0, top: 0 }),
  xyText: "",
  xyTextShow: false,
    xyDivStyle: reactive({ left: 0, top: 0 }),
});
const PolygonCmdSelect = reactive({
  menuStyle: reactive({}),
  menuRef: null,
  keyHandler: null,
  menuVisible: null,
  keyClick: function ({ item, key, keyPath }) {
    if (!PolygonCmdSelect.keyHandler) return;
    PolygonCmdSelect.keyHandler(key);
  },
  setXY: (x, y, ex, ey, show) => {
    if (!show) {
      xyPos.xyTextShow = false;
      return;
    }
    xyPos.xyTextShow = show;
    xyPos.xy.x = x;
    xyPos.xy.y = y;
    xyPos.xyText = x + "," + y;
    xyPos.xyStyle.left = ex + 10 + "px";
    xyPos.xyStyle.top = ey - 10 + "px";
    xyPos.xyDivStyle.left = ex - 4 + "px";
    xyPos.xyDivStyle.top = ey - 4 + "px";
  },
  showMenu: (x, y) => {
    const $menu = $(PolygonCmdSelect.menuRef);
    console.log("点击", $menu);
    PolygonCmdSelect.menuVisible = true;
    Object.assign(PolygonCmdSelect.menuStyle, {
      left: x + "px",
      top: y + "px",
    });
    $menu.show();
    $menu.click();
  },
  hideMenu: () => {
    let $menu = $(PolygonCmdSelect.menuRef);
    $menu.hide();
    PolygonCmdSelect.menuVisible = false;
    visible.value = false;
  },
});

const handleVisible = (v) => {
  if (PolygonCmdSelect.menuVisible != null) {
    if (PolygonCmdSelect.menuVisible != v) {
      visible.value = !v;
    }
  }
};
addHandler("PolygonCmdSelect", PolygonCmdSelect);

const { xy, xyStyle, xyText, xyTextShow, xyDivStyle } = toRefs(xyPos);
const {
  menuStyle,
  menuRef,
  keyHandler,
  menuVisible,
  keyClick,
  setXY,
  showMenu,
  hideMenu,
} = toRefs(PolygonCmdSelect);
</script>


<style lang="less" scoped>
  @import "../../assets/dot-style.less";
  @import "../../assets/cmd-select.less";
</style>
