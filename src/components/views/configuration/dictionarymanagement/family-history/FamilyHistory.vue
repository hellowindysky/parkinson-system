<template>
<div class="scroll-wrapper">
  <div class="freature-person-conf-wrapper" ref="scrollArea">
    <feature-folding-panel class="common-drugs" :title="'家庭史'" >
      <el-table :data="tableData">
        <el-table-column prop="xuhao" label="序号" align="center" width="80">
        </el-table-column>
        <el-table-column prop="name" label="疾病名称" align="center" width="250">
        </el-table-column>
        <el-table-column prop="tname" label="疾病类型" align="center" width="250">
        </el-table-column>
        <el-table-column prop="guige" label="疾病关联性" align="center" width="250">
        </el-table-column>
        <el-table-column prop="denxiao" label="属性" align="center" width="150">
        </el-table-column>
      </el-table>
    </feature-folding-panel>
  </div>
</div>
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
          xuhao: '01',
          name: '高血压',
          tname: '心脑血管疾病',
          guige: '相关联',
          denxiao: '系统默认'
        },
        {
          xuhao: '02',
          name: '其他',
          tname: '自定义',
          guige: '无关',
          denxiao: '系统默认'
        },
        {
          xuhao: '03',
          name: '癫痫',
          tname: '自定义',
          guige: '相关联',
          denxiao: '系统默认'
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>

@import "~styles/variables.less";
@tabs-wrapper-height: 15px;
@table-head-height: 0px;
.scroll-wrapper {
  position: relative;
  height: calc(~"100% - @{table-head-height}");
  margin-right: 20px;
  .freature-person-conf-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
    height: 100%;
    .ps__scrollbar-y-rail {
      position: absolute;
      top: 0;
      width: 15px;
      right: -2px;
      padding: 0 3px;
      box-sizing: border-box;
      opacity: 0.3;
      transition: opacity 0.3s, padding 0.2s;
      .ps__scrollbar-y {
        position: relative;
        background-color: #aaa;
        border-radius: 20px;
      }
    }
    &:hover {
      .ps__scrollbar-y-rail {
        opacity: 0.6;
        &:hover {
          padding: 0;
        }
      }
    }
    .common-drugs {
      width: 100%;
      position: relative;
      margin-right: 20px;
      box-sizing: border-box;
      .el-table {
        width: 981px;
        margin-top: 12px;
          .cell {
            text-align: center;
          }
      }
    }
  }
}
</style>
