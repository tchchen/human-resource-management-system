<template>
  <div class="app-container">
    <PageTools :show-left="showLeft">
      <template #slot-right>
        <el-button type="primary" size="small" @click="addPermissionBtn(1,'0')">添加权限</el-button>
      </template>
    </PageTools>
    <!-- 表格 -->
    <el-card style="margin-top:20px">
      <el-table
        style="width: 100%"
        :data="permissionList"
        border
        row-key="id"
      >
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="标识" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.type === 1" type="text" @click="addPermissionBtn(2,row.id)">添加</el-button>
            <el-button type="text" @click="editPermissionBtn(row)">编辑</el-button>
            <el-button type="text" @click="delPermissionBtn(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加权限对话框 -->
    <addOrEditDialog ref="addOrEditDialogRef" @addOrEditPermissionEV="addOrEditPermissionFn" :unhandledPermissionList="unhandledPermissionList"/>
  </div>
</template>

<script>
import { getPermissionListAPI, addPermissionAPI, getPermissionDetailAPI, editPermissonAPi, delPermissonAPI } from '@/api'
import { transTree } from '@/utils'
import addOrEditDialog from './components/addOrEditDialog.vue'

export default {
  name: 'Permission',
  components: {
    addOrEditDialog
  },
  data() {
    return {
      showLeft: false, // 不显示PageTools组件左侧插槽
      permissionList: [], // 处理的权限点数组
      unhandledPermissionList: [] // 未处理的使用权限点数组
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 获取所有权限点
    async getPermissionList() {
      const res = await getPermissionListAPI()
      this.permissionList = transTree(res.data, '0')
      this.unhandledPermissionList = res.data
    },
    // 添加权限按钮
    addPermissionBtn(type, pid) {
      this.$refs.addOrEditDialogRef.form.type = type // 权限点类型1为页面路由权限点, 2为按钮权限点
      this.$refs.addOrEditDialogRef.form.pid = pid // 权限点父级id页面权限点pid值为'0', 按钮权限点值为所属页面权限点的id值
      this.$refs.addOrEditDialogRef.showDialog = true
    },
    // 编辑权限按钮
    async editPermissionBtn(row) {
      // 获取权限点详情
      const res = await getPermissionDetailAPI(row.id)
      // 处理是否开启的 标识
      if (res.data.enVisible === '1') {
        res.data.enVisible = true
      } else {
        res.data.enVisible = false
      }
      this.$refs.addOrEditDialogRef.form = res.data // res.data 包含这个权限点的id
      this.$refs.addOrEditDialogRef.showDialog = true
    },
    // 添加权限对话框，自定义事件
    async addOrEditPermissionFn(formObj) {
      // 在这里处理发送给后台的数据,因为开启那个选项 值为boolean而后台·要的是1 0
      if (formObj.enVisible) {
        formObj.enVisible = '1'
      } else {
        formObj.enVisible = '0'
      }
      if (formObj.id) { // 有id的则为编辑权限点，id为被修改的权限点id
        const res = await editPermissonAPi(formObj)
        this.$message.success(res.message)
        // 刷新权限表格
        this.getPermissionList()
      } else { // 增加权限点
        const res = await addPermissionAPI(formObj)
        this.$message.success(res.message)
        // 刷新权限表格
        this.getPermissionList()
      }
    },
    // 删除权限点按钮
    delPermissionBtn(row) {
      this.$confirm(`确定删除 ${row.name} 这个权限点吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await delPermissonAPI(row.id)
        // 刷新权限点列表
        this.getPermissionList()
        this.$message({
          type: 'success',
          message: res.message
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style>

</style>
