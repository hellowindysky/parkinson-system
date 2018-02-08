<template>
  <feature-folding-panel class="common-drugs" :title="'常用药物'" >
    <el-table :data="tableData">
      <el-table-column prop="xuhao" label="序号" align="center" width="80">
      </el-table-column>
      <el-table-column prop="name" label="药品名称" align="center" width="150">
      </el-table-column>
      <el-table-column prop="tname" label="通用名（英）" align="center" width="150">
      </el-table-column>
      <el-table-column prop="guige" label="药品规格" align="center" width="150">
      </el-table-column>
      <el-table-column prop="denxiao" label="等效系数" align="center" width="150">
      </el-table-column>
      <el-table-column prop="fenlei" label="药品分类" align="center" width="150">
      </el-table-column>
      <el-table-column prop="shuxing" label="属性" align="center" width="150" >
      </el-table-column>
    </el-table>
  </feature-folding-panel>
</template>

<script>
import FeatureFoldingPanel from 'public/feature-folding-panel/FeatureFoldingPanel';

export default {
  components: {
    FeatureFoldingPanel
  },
  data() {
    return {
      tableData: [
        {
          xuhao: 1,
          name: '金刚烷胺',
          tname: 'Amantadine',
          guige: '250mg/片',
          denxiao: 1.3,
          fenlei: '金刚烷胺',
          shuxing: '系统默认'
        },
        {
          xuhao: 1,
          name: '美多芭',
          tname: 'Amantadine',
          guige: '10mg/片',
          denxiao: 2.2,
          fenlei: '金刚烷胺',
          shuxing: '自定义'
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
     th {
       text-align: center !important;
     }
  }
}
</style>
