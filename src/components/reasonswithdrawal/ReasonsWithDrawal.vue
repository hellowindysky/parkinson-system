<template>
  <feature-folding-panel class="common-drugs" :title="'停药原因'" >
    <el-table :data="tableData">
      <el-table-column prop="xuhao" label="序号" align="center" width="80">
      </el-table-column>
      <el-table-column prop="name" label="停药原因" align="center" width="150" >
      </el-table-column>
      <el-table-column prop="tname" label="停药类型" align="center"width="150" >
      </el-table-column>
      <el-table-column prop="guige" label="药物副作用是否必填" align="center" width="450" >
      </el-table-column>
      <el-table-column prop="denxiao" label="属性" align="center" width="150" >
      </el-table-column>
    </el-table>
  </feature-folding-panel>
</template>

<script>
import FeatureFoldingPanel from '../featurefoldingpanel/FeatureFoldingPanel';

export default {
  components: {
    FeatureFoldingPanel
  },
  data() {
    return {
      tableData: [
        {
          xuhao: '01',
          name: '药物副反应',
          tname: '药物原因',
          guige: '是',
          denxiao: '系统默认'
        },
        {
          xuhao: '02',
          name: '药物副反应',
          tname: '药物原因',
          guige: '否',
          denxiao: '系统默认'
        },
        {
          xuhao: '03',
          name: '效果不佳',
          tname: '病情变化',
          guige: '是',
          denxiao: '系统默认'
        },
        {
          xuhao: '04',
          name: '价格太贵',
          tname: '个人原因',
          guige: '是',
          denxiao: '系统默认'
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
@import "~styles/variables.less";
.common-drugs {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  .el-table {
    width: 981px;
    margin-top: 12px; 
    
  }
  .table-line {
      background: red;
    }
}
</style>
