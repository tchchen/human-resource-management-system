<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- 通用工具栏组件使用 -->
      <page-tools>
        <!-- 自定义左侧内容 -->
        <template #slot-left>
          <span>共 19 条记录</span>
        </template>

        <!-- 自定义右侧内容 -->
        <template #slot-right>
          <el-button v-power="'import'" type="danger" size="small" @click="uploadExcelBtn">导入excel</el-button>
          <el-button v-power="'export'"  type="success" size="small" @click="exportExcelBtn">导出excel</el-button>
          <el-button type="primary" size="small" @click="addEmployees">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 展示员工的表格 -->
      <el-card class="tableStaff">
        <el-table style="width: 100%;margin-bottom:20px" :data="staffList" border>
          <el-table-column align="center" type="index" label="序号" width="50" />
          <el-table-column align="center" prop="username" label="姓名" width="100" />
          <el-table-column align="center" label="头像" width="100">
            <template v-slot="{row}">
              <img :src="row.staffPhoto" alt="" width="90px">
            </template>
          </el-table-column>
          <el-table-column align="center" prop="mobile" label="手机号" width="116" />
          <el-table-column align="center" prop="workNumber" label="工号" width="80" :sort-method="sortMethod" sortable />
          <el-table-column align="center" label="聘用形式" width="80">
            <template v-slot="{row}">
              <span v-if="row.formOfEmployment===1">正式</span>
              <span v-else>非正式</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="departmentName" label="部门" width="100" />
          <el-table-column align="center" prop="timeOfEntry" label="入职时间" width="100" :formatter="formatterFn" />
          <el-table-column align="center" label="状态" width="70">
            <template>
              <el-switch
                v-model="value"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="width">
            <template v-slot="{row}">
              <el-button type="text" @click="lookDetailFn(row)">查看</el-button>
              <el-button type="text" @click="assignRoleFn(row)">分配角色</el-button>
              <el-button type="text" @click="delStaffFn(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          align="center"
          :current-page="page"
          :page-sizes="[2, 3, 5]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="getStaffList"
        />
      </el-card>
      <!-- 新增员工对话框 -->
      <el-dialog
        title="新增员工"
        :visible.sync="addDialogVisible"
        width="width"
        @close="dialogClose"
      >
        <EmpDialog ref="empDialogRef" :show-dialog.sync="addDialogVisible" :tree-data="treeData" @addStaffEV="addStaffFn" />
      </el-dialog>
      <!-- 分配角色 -->
      <el-dialog
        title="分配角色"
        :visible.sync="showRoleDialog"
        width="40%"
      >
        <AssignRoleDialog ref="assignRoleDialog" :show-role-dialog.sync="showRoleDialog" @assignRoleEV="assignStaffRoleFn" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getStaffListAPI, getDepartmentListAPI, addStaffAPI, getUserPhotoAPI, assignRoleStaffAPI, delStaffAPI } from '@/api'
import { transTree } from '@/utils'
import dayjs from 'dayjs'
import EmpDialog from './components/empDialog.vue'
import AssignRoleDialog from './components/assignRoleDialog.vue'

export default {
  name: 'Employess',
  components: {
    EmpDialog,
    AssignRoleDialog
  },
  data() {
    return {
      value: true, // 状态，开关
      page: 1,
      size: 5,
      total: 10,
      staffList: [], //  员工列表
      addDialogVisible: false, // 是否显示新增对话框
      treeData: [], // 部门信息
      showRoleDialog: false, // 分配权限的对话框
      checkRoleId: '' // 点击分配角色的员工id
    }
  },
  mounted() {
    this.getStaffList() // 获取员工列表数据
    this.getDepartmentList() // 获取部门名称
  },
  methods: {
    // 获取部门名称
    async getDepartmentList() {
      const res = await getDepartmentListAPI()
      this.treeData = transTree(res.data.depts, '')
    },
    // 获取员工列表数据
    async getStaffList(page = 1) {
      this.page = page
      const res = await getStaffListAPI(this.page, this.size)
      this.total = res.data.total
      this.staffList = res.data.rows
    },
    // 工号的排序
    sortMethod(a, b) {
      return b.workNumber - a.workNumber
    },
    // 每页展示多少条数据改变时触发
    async handleSizeChange(limit) {
      this.size = limit
      const res = await getStaffListAPI(this.page, this.size)
      this.total = res.data.total
      this.staffList = res.data.rows
    },
    // 处理入职时间
    formatterFn(row) {
      return dayjs(row.timeOfEntry).format('YYYY-MM-DD')
    },
    // 新增员工按钮
    addEmployees() {
      this.addDialogVisible = true
    },
    // 对话框关闭前的回调
    dialogClose() {
      this.$refs.empDialogRef.$refs.form.resetFields()
    },
    // 自定义事件
    async addStaffFn(data) {
      await addStaffAPI(data)
      this.$message.success('员工新增成功')
      // 更新员工列表
      this.getStaffList()
    },
    // 上传excel表格按钮
    uploadExcelBtn() {
      this.$router.push('/excel')
    },
    // 导出excel表格
    exportExcelBtn() {
      import('@/vendor/Export2Excel').then(excel => {
        // excel表格要的字段
        const headerArr = ['序号', '姓名', '头像', '手机号', '工号', '聘用形式', '部门', '入职时间']
        // 4.1 数据key的映射关系(思路: 遍历上边数组里按照顺序, 取出中文的名字, 但是对应数组值的数组, 要从英文key对象中取出value值, 我要用中文key换到英文key然后去取到值)
        const zhAndenObj = {
        // 序号可以等遍历的时候直接用索引值, 而不是来自于英文对象里
          '姓名': 'username',
          '头像': 'staffPhoto',
          '手机号': 'mobile',
          '工号': 'workNumber',
          '聘用形式': 'formOfEmployment',
          '部门': 'departmentName',
          '入职时间': 'timeOfEntry'
        }
        // 4.2 按照顺序, 形成值的数组 (明确目标->想要数据结构->读代码(每个变量意思)读2-3遍->仿写3-5遍)
        const data = this.staffList.map((enObj, index) => {
          const newArr = [] // 值小数组
          headerArr.forEach(zhKey => {
            if (zhKey === '序号') {
              newArr.push(index + 1)
            } else {
              const enKey = zhAndenObj[zhKey]
              const value = enObj[enKey]
              if (enKey === 'formOfEmployment') {
                let obj = value === 1 ? { id: 1, value: '正式' } : { id: 2, value: '非正式' }
                if (!value) {
                  obj = { value: '未知' }
                }
                newArr.push(obj.value)
              } else {
                newArr.push(value)
              }
            }
          })
          return newArr
        })
        // 导出excel表格
        excel.export_json_to_excel({
          header: headerArr, // 表头 必填
          data, // 具体数据 必填
          filename: 'excel-list', // 文件名称
          autoWidth: true, // 宽度是否自适应
          bookType: 'xlsx' // 生成的文件类型
        })
      })
    },
    // 查看员工详情按钮
    lookDetailFn(row) {
      this.$router.push(`/employees/detail?StaffId=${row.id}&EmploymentId=${row.formOfEmployment}`)
    },
    // 分配权限按钮
    async assignRoleFn(row) {
      this.checkRoleId = row.id
      this.showRoleDialog = true
      // 获取员工基本信息
      const res = await getUserPhotoAPI(row.id)
      this.$nextTick(() => {
        this.$refs.assignRoleDialog.checkRoleIdList = res.data.roleIds
      })
    },
    // 给员工分配角色对话框确定按钮【自定义事件】
    async assignStaffRoleFn(roleList) {
      const res = await assignRoleStaffAPI(this.checkRoleId, roleList)
      this.$message.success(res.message)
    },
    // 删除员工按钮
    delStaffFn(row) {
      this.$confirm(`是否删除 ${row.username} 这个角色`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await delStaffAPI(row.id)
        // 更新角色列表数据,留在当前页
        this.getStaffList(this.page)
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

<style lang="scss" scoped>
.tableStaff{
  margin-top: 20px;
}
</style>
