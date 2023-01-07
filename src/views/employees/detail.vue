<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置" class="margin:auto">
            <el-form ref="form" :rules="rules" :model="staffInfoBaseForm" label-width="80px" style="margin-left:25%;margin-top:20px">
              <el-form-item label="姓名：" prop="username">
                <el-input v-model="staffInfoBaseForm.username" type="text" style="width:300px;" />
              </el-form-item>
              <el-form-item label="密码：" prop="password">
                <el-input v-model="staffInfoBaseForm.password" type="password" style="width:300px;" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateUserInfo">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <userInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getStaffInfoBaseAPI, updateUserInfoBaseAPI } from '@/api'
import userInfo from '@/views/employees/detail/userInfo'

export default {
  name: 'Detail',
  components: {
    userInfo
  },
  data() {
    return {
      staffInfoBaseForm: {},
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      employmentId: this.$route.query.mploymentId
    }
  },
  mounted() {
    this.getStaffInfoBase() // 获取员工基本信息
  },
  methods: {
    // 获取员工基本信息
    async getStaffInfoBase() {
      const res = await getStaffInfoBaseAPI(this.$route.query.StaffId)
      this.staffInfoBaseForm = res.data
    },
    async updateUserInfo() {
      await updateUserInfoBaseAPI(this.staffInfoBaseForm)
      this.$message.success('更新信息成功')
    }
  }
}
</script>

<style>

</style>
