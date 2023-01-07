<template>
  <div>
    <el-checkbox-group v-model="checkRoleIdList">
      <el-checkbox v-for="obj in AllRoleList" :key="obj.id" :label="obj.id">
        <span>{{ obj.name }}</span>
      </el-checkbox>
    </el-checkbox-group>
    <el-row :gutter="10" justify="end" type="flex" class="row">
      <el-col :span="8">
        <el-button type="primary" size="small" @click="confirmFn">确定</el-button>
        <el-button size="small" @click="cancelFn">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getRoleListAPI } from '@/api'

export default {
  name: 'AssignRoleDialog',
  props: {
    showRoleDialog: {
      type: Boolean
    }
  },
  data() {
    return {
      AllRoleList: [], // 展示角色名称
      checkRoleIdList: [] // 选中的角色
    }
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    // 获取角色数据
    async getRoleList() {
      const res = await getRoleListAPI({
        page: 1,
        pagesize: 10
      })
      const resAll = await getRoleListAPI({
        page: 1,
        pagesize: res.data.total
      })
      this.AllRoleList = resAll.data.rows
    },
    confirmFn() {
      this.$emit('assignRoleEV', this.checkRoleIdList)
      this.$emit('update:showRoleDialog', false)
    },
    cancelFn() {
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style scoped>
.row{
  margin-top: 20px;
}
.el-checkbox{
  margin: 5px 5px;
}
</style>
