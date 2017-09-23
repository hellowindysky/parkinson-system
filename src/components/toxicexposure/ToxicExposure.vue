<template>
  <feature-folding-panel class="common-drugs" :title="'毒物接触史'" >
    <el-table :data="tableData">
      <el-table-column prop="xuhao" label="序号" align="center" width="80">
      </el-table-column>
      <el-table-column prop="name" label="分类" align="center" width="350">
      </el-table-column>
      <el-table-column prop="tname" label="名称" align="center" width="350">
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
          name: '重金属',
          tname: '汞',
          denxiao: '系统默认'
        },
        {
          xuhao: '02',
          name: '重金属',
          tname: '铬',
          denxiao: '系统默认'
        },
        {
          xuhao: '03',
          name: '重金属',
          tname: '铬',
          denxiao: '系统默认'
        },
        {
          xuhao: '04',
          name: '重金属',
          tname: '铬',
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
