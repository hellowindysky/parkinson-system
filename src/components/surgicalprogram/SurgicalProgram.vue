<template>
  <feature-folding-panel class="common-drugs" :title="'手术方案'" >
    <el-table :data="tableData">
      <el-table-column prop="xuhao" label="序号" align="center" width="80">
      </el-table-column>
      <el-table-column prop="name" label="手术名称" align="center" width="600">
      </el-table-column>
      <el-table-column prop="tname" label="属性" align="center" width="300">
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
          xuhao: 1,
          name: '立体定向损坏',
          tname: '系统默认'
        },
        {
          xuhao: 1,
          name: '脑深部电刺激',
          tname: '系统默认'
        },
        {
          xuhao: 1,
          name: '干细胞疗法',
          tname: '系统默认'
        },
        {
          xuhao: 1,
          name: '干细胞疗法',
          tname: '系统默认'
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
  .el-table__row {
    td {
      .cell {
        text-align: left;
      }
    }
  }
}
</style>
