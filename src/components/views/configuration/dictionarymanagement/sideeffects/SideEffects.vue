<template>
  <feature-folding-panel class="common-drugs" :title="'副作用'" >
    <el-table :data="tableData">
      <el-table-column prop="xuhao" label="序号" align="center" width="80">
      </el-table-column>
      <el-table-column prop="name" label="副作用类型" align="center" width="250">
      </el-table-column>
      <el-table-column prop="tname" label="常见症状" align="center" width="250">
      </el-table-column>
      <el-table-column prop="guige" label="严重程度" align="center" width="200">
      </el-table-column>
      <el-table-column prop="denxiao" label="属性" align="center" width="200">
      </el-table-column>
    </el-table>
  </feature-folding-panel>
</template>

<script>
import FeatureFoldingPanel from 'components/public/featurefoldingpanel/FeatureFoldingPanel';

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
          tname: '呕吐/头晕/腹泻',
          guige: '一般',
          denxiao: '系统默认'
        },
        {
          xuhao: '02',
          name: '毒性反应',
          tname: '中毒反应',
          guige: '严重',
          denxiao: '系统默认'
        },
        {
          xuhao: '03',
          name: '过敏反应',
          tname: '中毒反应',
          guige: '轻微',
          denxiao: '系统默认'
        },
        {
          xuhao: '04',
          name: '过敏反应',
          tname: '中毒反应',
          guige: '严重',
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
       .cell {
         text-align: center;
       }
  }
}
</style>
