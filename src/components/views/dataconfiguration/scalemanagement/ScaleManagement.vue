<template>
  <div class="scale-management" ref="scaleManagement" v-loading="loading" element-loading-text="加载中">
    <!-- 筛选栏 -->
    <div class="filter-bar" ref="filterBar">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="量表名称">
          <el-select v-model="scaleId" filterable clearable placeholder="请选择量表">
            <el-option
              v-for="scale in scaleList"
              :key="scale.scaleInfoId"
              :label="scale.gaugeName"
              :value="scale.scaleInfoId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="量表类型">
          <el-select v-model="scaleType" clearable placeholder="请输入量表类型">
            <el-option v-for="option in getOptions('gaugeType')" :label="option.name"
                :value="option.code" :key="option.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="scaleState" placeholder="请选择量表状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="废除" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快速答题">
          <el-select v-model="scaleQuickAnswer" placeholder="请选择量表状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="支持" value="1"></el-option>
            <el-option label="不支持" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一键快答">
          <el-select v-model="scaleOneQuickAnswer" placeholder="请选择量表状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="支持" value="1"></el-option>
            <el-option label="不支持" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="resetFilter">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="addNewScale">新增量表</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 量表列表 -->
    <el-table
      ref="scaleTable"
      :data="currentScaleList"
      :header-cell-style="{'text-align': 'center'}"
      style="width: 100%;"
      :height="tableHeight">
      <el-table-column
        type="index"
        :index="getScaleIndex"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="gaugeName"
        label="量表名称"
        min-width="500">
      </el-table-column>
      <el-table-column
        prop="gaugeNameEn"
        label="英文缩写"
        min-width="200">
      </el-table-column>
      <el-table-column
        label="量表类型"
        width="150">
        <template slot-scope="scope">
          <el-tag size="small">{{ getGaugeTypeText(scope.row.gaugeType) }}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="题型"
        width="100">
        <template slot-scope="scope">
          <el-tag size="small">{{ scope.row.formType === 1 ? '启用' : '废除' }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column
        label="快速答题"
        width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.quickAnswer === 1 ? '' : 'danger'" size="small">{{ getQuickAnswerText(scope.row.quickAnswer) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="一键快答"
        width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.oneQuickAnswer === 1 ? '' : 'danger'" size="small">{{ getOneQuickAnswerText(scope.row.oneQuickAnswer) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isUse === 1 ? '' : 'danger'" size="small">{{ getScaleStateText(scope.row.isUse) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="250">
        <template slot-scope="scope">
          <el-button :type="scope.row.isUse === 1 ? 'danger' : 'primary' " size="mini" @click="changeScaleState(scope.row.scaleInfoId, scope.row.isUse)">{{ scope.row.isUse === 1 ? '废除' : '启用' }}</el-button>
          <el-button type="mini" size="mini" @click="editScale(scope.row.scaleInfoId)">查看</el-button>
          <!-- <el-button type="danger" size="mini">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="scaleList.length">
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Util from 'utils/util.js';
import { deepCopy } from 'utils/helper';
import { updateScaleQuickAnswer } from 'api/dataManagement.js';

export default {
  data() {
    return {
      scaleId: '',
      scaleType: '',
      scaleState: '',
      scaleQuickAnswer: '',
      scaleOneQuickAnswer: '',
      tableHeight: 750,
      currentPage: 1,
      pageSizes: [10, 50, 100],
      pageSize: 10,
      loading: false
    };
  },
  computed: {
    ...mapGetters([
      'typeGroup',
      'allScale'
    ]),
    scaleList() {
      let list = deepCopy(this.allScale);
      /**
       * 根据过滤条件生成量表数组
       */
      if (this.scaleId !== '') {
        list = list.filter((ele) => {
          return ele.scaleInfoId === this.scaleId;
        });
      }
      if (this.scaleType !== '') {
        list = list.filter((ele) => {
          return ele.gaugeType === this.scaleType;
        });
      }
      if (this.scaleState !== '') {
        list = list.filter((ele) => {
          return ele.isUse === Number(this.scaleState);
        });
      }
      if (this.scaleQuickAnswer !== '') {
        list = list.filter((ele) => {
          return ele.quickAnswer === Number(this.scaleQuickAnswer);
        });
      }
      if (this.scaleOneQuickAnswer !== '') {
        list = list.filter((ele) => {
          return ele.oneQuickAnswer === Number(this.scaleOneQuickAnswer);
        });
      }
      return list;
    },
    /**
     * 量表分页 当前页面量表数组
     */
    currentScaleList() {
      return this.scaleList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },
  methods: {
    getOptions(fieldName) {
      var options = [];
      var typesInfo = Util.getElement('typegroupcode', fieldName, this.typeGroup);
      var types = typesInfo.types ? typesInfo.types : [];
      for (let type of types) {
        options.push({
          code: type.typeCode,
          name: type.typeName
        });
      }
      return options;
    },
    /**
     * 计算表格高度
     */
    resizeTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = this.$refs.scaleManagement.offsetHeight - this.$refs.filterBar.offsetHeight - 50;
        this.$refs.scaleTable.doLayout();
      });
    },
    /**
     * 获取当前量表在当前scaleList的索引
     */
    getScaleIndex(rowIndex) {
      return (this.currentPage - 1) * this.pageSize + rowIndex + 1;
    },
    /**
     * 根据量表字段获取对应的显示值
     */
    getGaugeTypeText(code) {
      var options = this.getOptions('gaugeType');
      var option = Util.getElement('code', code, options);
      return option.name ? option.name : '';
    },
    getFormTypeText(code) {
      let text = '';
      switch (code) {
        case 1:
          text = '启动';
          break;
        case 2:
          text = '废除';
          break;
        default:
          text = '废除';
      }
      return text;
    },
    getQuickAnswerText(code) {
      let text = '';
      switch (code) {
        case 1:
          text = '支持';
          break;
        case 0:
          text = '不支持';
          break;
        default:
          text = '不支持';
      }
      return text;
    },
    getOneQuickAnswerText(code) {
      let text = '';
      switch (code) {
        case 1:
          text = '支持';
          break;
        case 0:
          text = '不支持';
          break;
        default:
          text = '不支持';
      }
      return text;
    },
    getScaleStateText(code) {
      var options = this.getOptions('isScaleUse');
      var option = Util.getElement('code', code, options);
      return option.name ? option.name : '';
    },
    /**
     * 重置过滤条件
     */
    resetFilter() {
      this.scaleId = '';
      this.scaleType = '';
      this.scaleState = '';
      this.scaleQuickAnswer = '';
      this.scaleOneQuickAnswer = '';
      this.currentPage = 0;
    },
    /**
     * 新增量表
     */
    addNewScale() {
      this.$router.push({name: 'scaleDetails', params: { id: 'new'}});
    },
    /**
     * 启用/废除量表
     */
    changeScaleState(scaleInfoid, isUse) {
      this.loading = true;
      isUse = Number(!isUse);
      let params = {
        scaleInfoId: scaleInfoid,
        isUse: isUse
      };
      updateScaleQuickAnswer(params).then(() => {
        this.$store.dispatch('getScaleList').then(() => {
          this.loading = false;
        }, (error) => {
          console.log(error);
          this.loading = false;
        });
      });
    },
    /**
     * 编辑量表
     * id 量表scaleInfoId
     */
    editScale(id) {
      this.$router.push({name: 'scaleDetails', params: { id: id}});
    },
    /**
     * 更改每页显示数量
     */
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
    },
    /**
     * 更改当前显示的分页
     */
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    }
  },
  mounted() {
    // console.log(this.$refs.scaleTable);
    this.resizeTableHeight();
    window.onresize = () => {
      this.resizeTableHeight();
    };
  }
};
</script>

<style lang="less">
  .scale-management {
    position: relative;
    width: 100%;
    height: 100%;
    padding-bottom: 50px;
    box-sizing: border-box;
    .filter-bar {
      text-align: left;
    }
    .el-pagination {
      position: absolute;
      bottom: 9px;
      width: 100%;
    }
  }
</style>

