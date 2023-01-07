<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="80px">
    <el-form-item label="姓名" prop="username">
      <el-input v-model="form.username" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="form.mobile" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="入职时间" prop="timeOfEntry">
      <el-date-picker
        v-model="form.timeOfEntry"
        type="date"
        placeholder="请选择入职时间"
      />
    </el-form-item>
    <el-form-item label="聘用形式" prop="formOfEmployment">
      <el-select v-model="form.formOfEmployment" placeholder="请选择">
        <el-option
          label="正式"
          value="1"
        />
        <el-option
          label="非正式"
          value="2"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="工号" prop="workNumber">
      <el-input v-model="form.workNumber" placeholder="请输入工号" />
    </el-form-item>
    <el-form-item label="部门" prop="departmentName">
      <el-input v-model="form.departmentName" readonly placeholder="请输入部门" @focus="showTreeFn" />
      <el-tree v-show="showTree" :data="treeData" :props="defaultProps" @node-click="handleNodeClick" />
    </el-form-item>
    <el-form-item label="转正时间">
      <el-date-picker
        v-model="form.correctionTime"
        type="date"
        placeholder="请选择转正时间"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'EmpDialog',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      value: '',
      value1: '',
      form: {
        correctionTime: '',
        departmentName: '',
        formOfEmployment: '',
        mobile: '',
        timeOfEntry: '',
        username: '',
        workNumber: ''
      },
      // 添加表单的校验字段
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showTree: false // 是否显示部门树形控件
    }
  },
  methods: {
    // 表单取消按钮
    cancel() {
      this.$refs.form.resetFields() // 重置表单
      this.$emit('update:showDialog', false)
    },
    // 表单确定按钮
    onSubmit() {
      this.$refs.form.validate(vlid => {
        if (vlid) {
          // 发起添加员工请求
          this.$emit('addStaffEV', { ...this.form })
          // 关闭对话框
          this.$emit('update:showDialog', false)
        }
      })
    },
    // 获取部门输入框焦点
    showTreeFn() {
      this.showTree = true
    },
    // 选择部门
    handleNodeClick(data) {
      if (data && data.children) { // 如果点击在的这个部门有子部门，则不选中这个部门
        return
      }
      this.form.departmentName = data.name
      this.showTree = false
    }
  }
}
</script>

<style>

</style>
