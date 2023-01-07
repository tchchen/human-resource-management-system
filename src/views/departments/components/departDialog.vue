<template>
  <el-dialog
    :title="isEdit ? '编辑子部门' : '添加子部门'"
    :visible.sync="dialogVisible"
    width="width"
    @close="closeFn"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="form.manager" placeholder="请选择">
          <el-option v-for="obj in simpleList" :key="obj.id" :label="obj.username" :value="obj.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align:center">
      <el-button @click="cancelFn">取 消</el-button>
      <el-button type="primary" @click="comfirmFn">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'DepartDialog',
  props: {
    simpleList: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean
    },
    testingList: {
      type: Array,
      default: () => []
    },
    clickDepartId: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateCode = (rule, value, callback) => {
      if (!this.isEdit) { // 如果不是要编辑部门，选择全部部门编码进行判断
        var codeList = this.testingList.map(item => item.code)
      } else { // 如果要编辑部门，不选择当前的部门编码进行判断
        const newArr = this.testingList.filter(item => item.id !== this.clickDepartId)
        codeList = newArr.map(item => item.code)
      }
      codeList.includes(value) ? callback(new Error(`${value}是重复的部门编码`)) : callback()
    }
    const validateName = (rule, value, callback) => {
      if (!this.isEdit) { // 如果不是要编辑部门，选择全部部门名称进行判断
        var nameList = this.testingList.map(item => item.name)
      } else { // 如果要编辑部门，不选择当前的部门编码进行判断
        const newArr = this.testingList.filter(item => item.id !== this.clickDepartId)
        nameList = newArr.map(item => item.name)
      }
      nameList.includes(value) ? callback(new Error(`${value}是重复的部门名称`)) : callback()
    }
    return {
      form: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      dialogVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入部门编码', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '请选择部门负责人', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '请输入部门介绍', trigger: 'blur' },
          { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 对话框确定按钮
    comfirmFn() {
      this.$refs.form.validate(val => {
        if (val) {
          this.dialogVisible = false
          this.$emit('addDepartmentEV', { ...this.form })
        }
      })
    },
    // 对话框取消按钮
    cancelFn() {
      this.dialogVisible = false
    },
    // 对话框关闭前
    closeFn() {
      this.form = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style>

</style>
