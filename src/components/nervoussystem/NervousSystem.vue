<template>
  <feature-folding-panel class="common-drugs" :title="'神经系统'" >
    <el-table :data="tableData">
      <el-table-column prop="xuhao" label="序号" align="center" width="80">
      </el-table-column>
      <el-table-column prop="name" label="检查名称" align="center" width="350">
      </el-table-column>
      <el-table-column prop="tname" label="检查类型" align="center" width="350">
      </el-table-column>
      <el-table-column prop="denxiao" label="属性" align="center" width="200">
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
          name: '头部前倾',
          tname: 'ew',
          denxiao: '系统默认'
        },
        {
          xuhao: '02',
          name: '肝功能八项',
          tname: 'ew',
          denxiao: '系统默认'
        },
        {
          xuhao: '03',
          name: '共济（闭目难立症）',
          tname: 'ew',
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
