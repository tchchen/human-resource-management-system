<template>
  <div class="dashboard-container">
    <!-- 头部 -->
    <el-card>
     <div class="box">
       <el-avatar :size="100" :src="avatar"></el-avatar>
        <h3>{{newTimeFn()}}，{{name}}。祝你开心每一天</h3>
     </div>
    </el-card>
    <!-- 日历 -->
    <el-row :gutter="10" style="margin-top:20px">
      <el-col :span="12">
        <el-card>
          <h2>工作日历</h2>
          <el-divider></el-divider>
          <el-calendar v-model="value"></el-calendar>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="margin-bottom: 20px">
          <div class="process">
            <h2><span>流程申请</span></h2>
            <button>加班离职</button>
            <button>请假调休</button>
            <button>审批列表</button>
            <button>我的信息</button>
          </div>
        </el-card>
        
        <el-card class="helpConnect">
          <h2><span>帮助连接</span></h2>
          <el-row class="helpConnect_row">
            <el-col :span="8">
              <a href="#">
                <span class="one"></span>
                <p>入门指南</p>
              </a>
            </el-col>
            <el-col :span="8">
              <a href="#">
                <span class="tow"></span>
                <p>在线帮助手册</p>
              </a>
            </el-col>
            <el-col :span="8">
              <a href="#">
                <span class="three"></span>
                <p>联系技术支持</p>
              </a>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data(){
    return {
      value: new Date(),
      activeName: 'name'
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    ...mapGetters([
      'avatar'
    ])
  },
  methods: {
      // 当前小时的时间
    newTimeFn(){
      const time = new Date().getHours()
      if(time>0 && time<=6){
        return '凌晨好'
      }else if(time>=6&&time<10){
        return '早上好'
      }else if(time>=10 && time<14){
        return '中午好'
      }else if(time>=14 && time<18 ){
        return '下午好'
      }else if(time>=18 && time<=22){
        return '晚上好'
      }else if(time>=22 && time<=24){
        return '傍晚好'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container{
  padding: 20px;
  .box{
    display: flex;
    align-items: center;
    h3{
      padding-left: 20px;
    }
  }
}
.process{
  h2{
    span{
      border-bottom: 4px solid rgb(52, 161, 234);
      padding-bottom: 20px;
    }
  }
  button{
    background: #fff;
    border: 1px solid rgb(97, 198, 225);
    padding: 10px 15px;
    margin: 20px 10px;
    border-radius: 6px;
  }
  button:hover{
    background: #75bee03d;
  }
}
.helpConnect{
  h2{
    span{
      border-bottom: 4px solid rgb(52, 161, 234);
      padding-bottom: 20px;
    }
  }
  .helpConnect_row{
    margin-top: 40px;
    a{
      display: flex;
      align-items: center;
      flex-direction:column;
    }
    span{
      display: inline-block;
      width: 76px;
      height: 76px;
      background: url('http://ihrm.itheima.net/static/img/icon.0ad0f0d5.png') no-repeat;
    }
    .one{
      background-position: 0 0;
    }
    .tow{
      background-position: -220px 0;
    }
    .three{
      background-position: -460px 0;
    }
  }
}
</style>
