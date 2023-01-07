<template>
  <div class="user-info">
    <!-- 个人信息 -->
    <el-form label-width="130px">
      <!-- 工号 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="工号">
            <el-input v-model="userInfo.workNumber" class="inputW" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="入职时间">
            <el-date-picker
              v-model="userInfo.timeOfEntry"
              style="width: 300px"
              type="date"
              class="inputW"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 姓名 部门 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input v-model="userInfo.username" class="inputW" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门">
            <el-input v-model="userInfo.departmentName" class="inputW" />
          </el-form-item>
        </el-col>
      </el-row>
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="手机">
            <el-input v-model="userInfo.mobile" readonly style="width: 300px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="聘用形式">
            <el-select v-model="userInfo.formOfEmployment" class="inputW">
              <el-option
                label="正式"
                :value="1"
              />
              <el-option
                label="非正式"
                :value="2"
              />
              <el-option
                label="未知"
                value=""
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片 -->
            <UploadImg ref="uploadImg" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="saveUser">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getStaffInfoBaseAPI, updateUserInfoBaseAPI } from '@/api'

export default {
  name: 'DetailUserInfo',
  data() {
    return {
      userId: this.$route.query.StaffId,
      userInfo: {}
    }
  },
  created() {
    // 调用获取用户信息的 API
    this.loadUserInfoById()
  },
  methods: {
    async loadUserInfoById() {
      const res = await getStaffInfoBaseAPI(this.userId).catch(err => err)
      if (!res.success) return this.$message.error(res.message)
      this.userInfo = res.data
      this.$refs.uploadImg.imageUrl = this.userInfo.staffPhoto
      this.$set(this.userInfo, 'formOfEmployment', parseInt(this.$route.query.EmploymentId))
    },
    // 更新保存按钮
    async saveUser() {
      // 将腾讯云的图片地址，带给后台
      this.userInfo.staffPhoto = this.$refs.uploadImg.imageUrl
      const res = await updateUserInfoBaseAPI(this.userInfo)
      this.$message.success(res.message)
    }
  }
}
</script>

<style scoped lang="scss">
  .user-info{
    padding-top:20px;
  }
</style>
