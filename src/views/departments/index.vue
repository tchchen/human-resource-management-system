<template>
  <div class="departments-container">
    <div class="app-container">
      <el-card class="box-card">
        <div slot="header">
          <el-tabs v-model="activeName">
            <el-tab-pane label="组织架构" name="first" class="tab-pane">
              <el-row type="flex" justify="space-between" align="middle" class="department-header">
                <!-- 第一列20份 -->
                <el-col :span="20">
                  <i class="el-icon-s-home" />
                  <span class="company">江苏传智播客教育科技股份有限公司</span>
                </el-col>
                <!-- 第二列4份 -->
                <el-col :span="4">
                  <!-- 在容器范围里, 一行再分2列 -->
                  <el-row type="flex" justify="end">
                    <el-col>负责人</el-col>
                    <el-col>
                      <!-- 这个之前在头部导航右侧下拉菜单讲过 -->
                      <el-dropdown>
                        <!-- 下拉菜单文字 -->
                        <span class="el-dropdown-link">
                          操作<i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <!-- 下拉项 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="add()">添加子部门</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-tree class="departments-tree" :data="treeData" :props="defaultProps" node-key="id" :expand-on-click-node="false">
                <!-- 默认插槽  并且使用内部的数据进行自定义模板的渲染, scope.data 所以直接key解构赋值变量也是data(对应数据对象)-->
                <template #default="{ data }">
                  <el-row
                    type="flex"
                    justify="space-between"
                    align="middle"
                    style="height: 40px; width: 100%;"
                  >
                    <!-- 部门名字 -->
                    <el-col :span="20">
                      <span>{{ data.name }}</span>
                    </el-col>
                    <!-- 功能操作区域 -->
                    <el-col :span="4">
                      <el-row type="flex" justify="end">
                        <!-- 两个内容 -->
                        <el-col>{{ data.manager }}</el-col>
                        <el-col>
                          <!-- 下拉菜单 element -->
                          <el-dropdown>
                            <span> 操作<i class="el-icon-arrow-down" /> </span>
                            <!-- 下拉菜单 -->
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item @click.native="add(data)">添加子部门</el-dropdown-item>
                              <el-dropdown-item @click.native="edit(data)">编辑部门</el-dropdown-item>
                              <el-dropdown-item v-if="!data.children" @click.native="del(data)">删除部门</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </template>
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
    </div>
    <!-- 添加和编辑部门对话框组件 -->
    <DepartDialog ref="departDialogRef" :is-edit="isEdit" :click-depart-id="clickDepartId" :simple-list="simpleList" :testing-list="testingList" @addDepartmentEV="addDepartmentFn" />
  </div>
</template>

<script>
import { getDepartmentListAPI, getSimpleListAPI, addDepartmentAPI, getDepartmentDetailsAPI, updateDepartmentDetailAPI, deleteDepartmentAPI } from '@/api'
import { transTree } from '@/utils'
import DepartDialog from './components/departDialog.vue'

export default {
  name: 'Departments',
  components: {
    DepartDialog
  },
  data() {
    return {
      activeName: 'first',
      // 树形控件数据
      treeData: [],
      // 定义结构显示
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      simpleList: [], // 负责人列表
      clickDepartId: '',
      isEdit: true, // 是否是编辑对话框
      testingList: [] // 用于给对话框的表单，检测重复的部门编码、同级部门名称
    }
  },
  mounted() {
    this.getDepartmentList() // 获取组织架构列表
    this.getSimpleList() // 获取负责人名称列表
  },
  methods: {
    // 获取组织架构列表
    async getDepartmentList() {
      const { data: res } = await getDepartmentListAPI()
      this.testingList = res.depts.map(item => {
        return {
          id: item.id,
          code: item.code,
          name: item.name,
          pid: item.pid
        }
      })
      this.treeData = transTree(res.depts, '')
    },
    // 获取负责人名称列表
    async getSimpleList() {
      const res = await getSimpleListAPI()
      this.simpleList = res.data
    },
    // 添加子部门
    add(data) {
      if (data === undefined) { // 添加一级部门则 它的父id一个为空
        this.clickDepartId = ''
      } else { // 添加子级部门则 它的父id不为空
        this.clickDepartId = data.id
      }
      this.isEdit = false
      this.$refs.departDialogRef.dialogVisible = true
    },
    // 编辑部门
    async edit(data) {
      this.clickDepartId = data.id
      this.isEdit = true
      const res = await getDepartmentDetailsAPI(data.id) // 获取部门详情
      this.$refs.departDialogRef.form = res.data
      this.$refs.departDialogRef.dialogVisible = true
    },
    // 删除部门
    del(data) {
      this.$confirm(`是否删除 ${data.name} 这个部门?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteDepartmentAPI(data.id)
        this.getDepartmentList()
        this.$message({
          type: 'success',
          message: '已删除此部门!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 对话框确定按钮的自定义事件
    async addDepartmentFn(fromObj) {
      if (this.isEdit) { // 是编辑对话框的确定按钮
        await updateDepartmentDetailAPI(fromObj)
        this.$message.success('编辑成功')
        this.getDepartmentList()
      } else { // 不是编辑对话框的确定按钮
        fromObj.pid = this.clickDepartId
        await addDepartmentAPI(fromObj)
        this.$message.success('添加成功')
        this.getDepartmentList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 10px;
}
.tab-pane {
  padding: 20px 80px;
  .company {
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
  }
  .department-header {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
  .departments-tree {
    margin: 12px 0px;
  }
}
</style>
