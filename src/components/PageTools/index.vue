<template>
  <el-card>
    <div class="page-tools">
      <!-- 左侧 -->
      <div v-if="showLeft" class="left">
        <div class="tips">
          <i class="el-icon-info" />
          <slot name="slot-left" />
        </div>
      </div>

      <div :class="{right: !showLeft}">
        <!-- 右侧 -->
        <slot name="slot-right" />
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'PageTools',
  props: {
    showLeft: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.page-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .tips {
    line-height: 34px;
    padding: 0px 15px;
    border-radius: 5px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);

    i {
      margin-right: 10px;
      color: #409eff;
    }
  }
  .right{
    width: 100%;
    display: flex;
    justify-content: end;
  }
}
</style>
