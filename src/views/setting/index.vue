<template>
  <div class="departments-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-tabs v-model="activeName">
          <!-- 角色管理 -->
          <el-tab-pane label="角色管理" name="first" class="tab-pane">
            <el-button icon="el-icon-plus" type="primary" @click="addRoles">新增角色</el-button>
            <!-- 角色表格 -->
            <el-table border style="width: 100%;margin:20px 0" :data="roleList">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column prop="name" label="角色名" width="90" />
              <el-table-column prop="description" label="描述" width="width" />
              <el-table-column prop="prop" label="操作" width="237" fixed="right">
                <template v-slot="{row}">
                  <el-button type="primary" size="small" @click="AssignDialogBtn(row)">分配权限</el-button>
                  <el-button type="success" size="small" @click="editBtn(row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="deleteBtn(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination
              align="center"
              :current-page="page"
              :page-sizes="[2, 3, 4]"
              :page-size="pagesize"
              layout="total,sizes ,prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="getRoleList"
            />
          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息" name="second" class="tab-pane">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使的公司资料被重新审核，请谨慎修改"
              type="info"
              style="margin-bottom:20px"
              :closable="false"
              show-icon
            />
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="公司名称">
                <el-input v-model="companyObj.name" disabled />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyObj.companyAddress" disabled />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="companyObj.mailbox" disabled />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyObj.remarks" disabled rows="3" type="textarea" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 新增角色的对话框 -->
      <el-dialog
        :title="flag ? '新增角色' : '编辑角色'"
        :visible.sync="dialogVisible"
        width="width"
        @close="dialogClose"
      >
        <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align:center">
          <el-button @click="cancelFn">取 消</el-button>
          <el-button type="primary" @click="confirmFn">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="showAssignDialog"
        width="width"
        @close="permissionDialogClose">
        <el-tree
          :data="permissionList"
          show-checkbox
          node-key="id"
          default-expand-all
          check-strictly
          ref="tree"
          :props="defaultProps">
        </el-tree>
        <div slot="footer">
          <el-button @click="assignDialogCancel">取 消</el-button>
          <el-button type="primary" @click="assignDialogConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoleListAPI, getCompanyInfoAPI, addRolesAPI, getUserInfoAPI, editRolesAPI, deleteRoleAPI,getRoleDetailAPI,assignPremAPI } from '@/api'
import {getPermissionListAPI} from '@/api'
import {transTree} from '@/utils'

export default {
  name: 'Setting',
  data() {
    return {
      activeName: 'first', // tabs切换，的name
      form: {}, // 表单绑定的值
      page: 1, // 当前页
      pagesize: 2, // 每页展示多少条数据
      total: 0, // 共有多少条数据
      roleList: [], // 存储角色列表
      companyObj: {}, // 公司信息对象
      dialogVisible: false, // 对话框是否显示
      roleForm: { // 新增表单绑定的值
        name: '',
        description: ''
      }, 
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      flag: true, // 区分是 新增对话框 还是 编辑对话框
      showAssignDialog: false, // 是否显示分配权限的对话框
      permissionList: [], // 所有权限点
      defaultProps: {
        label: 'name'
      },
      permissionIdList: [], // 某个角色 的权限点数组
      clickAssignRoleId: '' // 点击分配角色按钮，的角色id
    }
  },
  mounted() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo() // 获取公司信息
    this.getPermissionList() // 获取所有权限点
  },
  methods: {
    // 获取角色列表
    async getRoleList(page = 1) { // page当前页改变时的页数，默认为第一页
      if (!this.flag) { // 如果是编辑角色则留在当前页
      } else { // 是新增角色则回到首页
        this.page = page
      }
      const { data: res } = await getRoleListAPI({ page: this.page, pagesize: this.pagesize })
      this.total = res.total
      this.roleList = res.rows
    },
    // 获取公司信息
    async getCompanyInfo() {
      const result = await getUserInfoAPI() // / 获取用户信息【拿到公司id】
      const res = await getCompanyInfoAPI(result.data.companyId)
      this.companyObj = res.data
    },
    // 获取所有权限点
    async getPermissionList(){
      const res = await getPermissionListAPI()
      this.permissionList = transTree(res.data,'0')
    },
    // 每页展示多少条数据
    async handleSizeChange(limit) {
      this.pagesize = limit
      // 重新请求角色列表数据
      const { data: res } = await getRoleListAPI({ page: this.page, pagesize: this.pagesize })
      this.total = res.total
      this.roleList = res.rows
    },
    // 新增角色按钮
    addRoles() {
      this.flag = true
      this.dialogVisible = true
    },
    // 新增和编辑共用对话框确定按钮
    confirmFn() {
      this.$refs.roleForm.validate(async val => {
        if (val) { // 是新增对话框的 确定按钮
          if (this.flag) {
            await addRolesAPI(this.roleForm) // 发起新增角色请求
            this.$message.success('新增角色成功')
            this.getRoleList() // 更新角色列表
          } else { // 是编辑对话框的 确定按钮
            await editRolesAPI(this.roleForm)// 发起编辑角色请求
            this.getRoleList() // 更新角色列表
            this.$message.success('编辑角色成功')
          }
          this.dialogVisible = false
        }
      })
    },
    // 取消按钮
    cancelFn() {
      this.dialogVisible = false
    },
    // 对话框关闭的回调
    dialogClose() {
      this.roleForm = { name: '', description: '' }
      this.$refs.roleForm.resetFields() // 清空表单
    },
    // 点击编辑按钮
    editBtn(row) {
      this.flag = false
      this.roleForm = row
      this.dialogVisible = true
    },
    // 点击删除按钮
    deleteBtn(row) {
      this.$confirm(`确定删除 ${row.name} 这个角色吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteRoleAPI(row.id)
        // 更新角色列表
        this.getRoleList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击分配权限按钮
    async AssignDialogBtn(row){
      this.clickAssignRoleId = row.id
      this.showAssignDialog = true
      // 获取被点击的这个角色的 角色详情【permIds为这个角色的权限点】
      const res = await getRoleDetailAPI(row.id)
      this.permissionIdList = res.data.permIds
      // 调用树形控件的默认选中方法，接收的是一个数组
      this.$refs.tree.setCheckedKeys(this.permissionIdList)
    },
    // 分配权限对话框的取消按钮
    assignDialogCancel(){
      this.showAssignDialog = false
    },
    // 分配权限对话框的确定按钮
    async assignDialogConfirm(){
      const res = await assignPremAPI({id: this.clickAssignRoleId,permIds: this.$refs.tree.getCheckedKeys()})
      this.$message.success(res.message)
      // 重新获取所有权限点
      this.getPermissionList()
      this.showAssignDialog = false
    },
    // 分配权限对话框关闭的回调
    permissionDialogClose(){
      this.permissionIdList = []
      // 清空默认选中
      this.$refs.tree.setCheckedKeys(this.permissionIdList)
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 10px;
  .tab-pane {
    padding: 10px 30px;
  }
}
</style>
