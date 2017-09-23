<template>
  <feature-folding-panel class="common-drugs" :title="'医学量表'" >
    <el-table :data="tableData">
      <el-table-column prop="xuhao" label="序号" align="center" width="80">
      </el-table-column>
      <el-table-column prop="name" label="量表名称" align="center" width="250">
      </el-table-column>
      <el-table-column prop="tname" label="英文名" align="center" width="150">
      </el-table-column>
      <el-table-column prop="guige" label="量表分类" align="center" width="200">
      </el-table-column>
      <el-table-column prop="denxiao" label="细化分类" align="center" width="200">
      </el-table-column>
      <el-table-column prop="shuxing" label="属性" align="center" width="100">
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
          name: '统一帕金森评定量表第三部分(开关期评分)',
          tname: 'UPDRS',
          guige: '运动症状类',
          denxiao: '疼痛类',
          shuxing: '系统默认'
        },
        {
          xuhao: '02',
          name: '39项帕金森病生存质量调查问卷',
          tname: 'SF-39',
          guige: '生活质量评定表',
          denxiao: '疼痛类',
          shuxing: '系统默认'
        },
        {
          xuhao: '03',
          name: '39项帕金森病生存质量调查问卷',
          tname: 'SF-39',
          guige: '生活质量评定表',
          denxiao: '疼痛类',
          shuxing: '系统默认'
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
  padding: 0 20px;
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
