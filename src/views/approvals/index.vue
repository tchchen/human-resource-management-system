<template>
  <div>
    审批
  </div>
</template>

<script>
import {getApprovalListAPI} from '@/api'

export default {
  name: 'Approvals',
  async mounted(){
    const res = await getApprovalListAPI()
    // console.log(res)
  }
}
</script>

<style>

</style>
