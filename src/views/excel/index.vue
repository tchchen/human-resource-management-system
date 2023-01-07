<template>
  <div class="app-container">
    <upload-excel-component
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    />
    <el-table
      :data="tableData"
      border
      style="width: 100%;margin-top:20px;"
    >
      <el-table-column
        v-for="item of tableHeader"
        :key="item"
        :prop="item"
        :label="item"
      />
    </el-table>
  </div>
</template>

<script>
// 导入上传的组件
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { batchStaffAPI } from '@/api'
import { formatExcelDate } from '@/utils'
import dayjs from 'dayjs'

export default {
  name: 'UploadExcel',
  // 绑定上传组件
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    // 上传之前的函数
    beforeUpload(file) {
      // 如判断文件的大小是否大于 1 兆
      const isLt1M = file.size / 1024 / 1024 < 1

      // 若大于 1 兆则停止解析并提示错误信息。
      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    // 成功调用之后的函数，它会返回表格的表头和内容。【读取excel表格】
    async handleSuccess({ results, header }) {
      this.tableData = results // 被上传的表格内容渲染到页面的 表格里
      this.tableHeader = header // 被上传每一列的列名渲染到页面的 表格里
      // 定义好表格需要的列标题名，和对应的变量名称
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }
      // 因为需要将被上传的表格，内容按照格式传给后台。
      // 所以需要将表格中文列名称，改为对应的字段
      // 每循环一次产生一个对应表格列名称的 英文key对象
      const newArr = results.map(item => { // item是表格每一行，这一行为一个对象
        const obj = {}
        //  先取出这个对象所有的属性名： ['姓名'， ‘手机号’]
        //  然后遍历这个数组，通过 中文名去 userRelations 找对应英文名， 保存值
        const contentKeys = Object.keys(item)
        contentKeys.forEach(key => {
        // 找到对应的英文名
          const transKey = userRelations[key]
          // 如果格式化的是时间，需要进行转换
          if (transKey === 'timeOfEntry' || transKey === 'correctionTime') {
            // 表格的天数->转成日期对象
            const transDate = new Date(formatExcelDate(item[key]))
            // 再把日期对象转成->'年-月-日'保存到对象属性里给后台
            obj[transKey] = dayjs(transDate).format('YYYY-MM-DD')
          } else {
            obj[transKey] = item[key]
          }
          obj[transKey] = item[key]
        })
        return obj
      })
      // 将批量导入的员工信息，发送给后台
      const res = await batchStaffAPI(newArr)
      this.$message.success(res.message)
    }
  }
}
</script>
