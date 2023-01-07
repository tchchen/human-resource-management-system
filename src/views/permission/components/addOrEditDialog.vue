<template>
  <el-dialog
    :title="form.id ? '编辑权限点':'新增权限点'"
    :visible.sync="showDialog"
    width="width"
    @close="dialogClose"
  >
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="form.description" />
      </el-form-item>
      <el-form-item label="开启">
        <el-switch
          v-model="form.enVisible"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" align="center">
      <el-button @click="cancelFn">取 消</el-button>
      <el-button type="primary" @click="confirmFn">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    unhandledPermissionList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    // 新添加的 子权限点名称不能和当前父权限点的子权限点名称重复
    const valiName = (rule,value,callback) => {
      let newArr = this.unhandledPermissionList.filter(item => item.pid === this.form.pid )
      .map(item => item.name) // 找到父权限点，在从父权限点提出子权限点的name
      // 如果是编辑权限点 要父级部门下但除了自己的name
      if(this.form.id){
        newArr = this.unhandledPermissionList.filter(item => item.pid === this.form.pid && item.id !== this.form.id)
      .map(item => item.name)
      }
      newArr.includes(value) ? callback(new Error(`这个 ${value} 权限名称已存在`)) : callback()
    }
    const valiCode = (rule,value,callback) => {
      // 拿到所有的code
      let newArr = this.unhandledPermissionList.map(item => item.code)
      // 如果是编辑权限点 要父级部门下但除了自己的name
      if(this.form.id){
        newArr = this.unhandledPermissionList.filter(item => item.id !== this.form.id)
      .map(item => item.code)
      } 
      newArr.includes(value) ? callback(new Error(`这个 ${value} 权限标识已存在`)) : callback()
    }
    return {
      showDialog: false,
      rules: {
        name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' },
          { validator: valiName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入权限标识', trigger: 'blur' },
          { validator: valiCode, trigger: 'blur' },
        ]
      },
      form: {
        enVisible: true,
        description: '',
        code: '',
        name: '',
        type: null,
        pid: null
      }
    }
  },
  methods: {
    // 对话框关闭
    dialogClose() {
      // 清空表单
      this.form = this.$options.data().form
    },
    // 取消按钮
    cancelFn() {
      this.$refs.form.resetFields()
      this.showDialog = false
    },
    // 确定按钮
    confirmFn() {
      this.$refs.form.validate(vali => {
        if (vali) {
          this.$emit('addOrEditPermissionEV', { ...this.form })
          this.showDialog = false
        }
      })
    }
  }
}
</script>

<style>

</style>
