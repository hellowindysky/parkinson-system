<template lang="html">
  <div class="modal-box-wrapper" v-show="displayModal">
    <div class="modal-box">
      <h3 class="title">{{title}}</h3>
      <div class="seperate-line"></div>
      <div class="button cancel-button" @click="cancel">取消</div>
      <div class="button submit-button" @click="cancel">确定</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Bus from 'utils/bus.js';

export default {
  data() {
    return {
      displayModal: false,
      modalType: '',
      title: '',
      item: {}
    };
  },
  computed: {
    ...mapGetters([
      'medHistoryTemplate',
      'diseaseHistoryTemplate',
      'familyHistoryTemplate',
      'coffeeHistoryTemplate',
      'teaHistoryTemplate',
      'smokeHistoryTemplate',
      'wineHistoryTemplate',
      'exerciseHistoryTemplate',
      'toxicExposureHistoryTemplate',

      'medHistoryDictionary',
      'diseaseHistoryDictionary',
      'familyHistoryDictionary',
      'coffeeHistoryDictionary',
      'teaHistoryDictionary',
      'smokeHistoryDictionary',
      'wineHistoryDictionary',
      'exerciseHistoryDictionary',
      'toxicExposureHistoryDictionary',

      'typeGroup'
    ]),
    dictionary() {
      if (this.modalType === this.MEDICINE_MODAL) {
        return this.medHistoryDictionary;
      } else if (this.modalType === this.DISEASE_MODAL) {
        return this.diseaseHistoryDictionary;
      } else if (this.modalType === this.FAMILY_MODAL) {
        return this.familyHistoryDictionary;
      } else if (this.modalType === this.PERSON_MODAL) {
        // 如果是个人信息面板，则将几个子字典合并成一个新的总字典
        return [].concat(this.coffeeHistoryDictionary, this.teaHistoryDictionary,
           this.smokeHistoryDictionary, this.wineHistoryDictionary, this.exerciseHistoryDictionary);
      } else if (this.modalType === this.TOXIC_MODAL) {
        return [].concat(this.toxicExposureHistoryDictionary);
      }
    }
  },
  methods: {
    showPanel(title, item, modalType) {
      this.displayModal = true;
      this.modalType = modalType;
      this.title = title;
      this.item = Object.assign({}, item);
      console.log(this.dictionary);
    },
    cancel() {
      this.displayModal = false;
    }
  },
  mounted() {
    Bus.$on(this.SHOW_MODAL_BOX, this.showPanel);
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";
.modal-box-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 500;
  .modal-box {
    position: relative;
    margin: auto;
    top: 10%;
    width: 80%;
    max-width: 600px;
    background-color: @background-color;
    .title {
      padding: 10px 0;
    }
    .seperate-line {
      width: 80%;
      height: 1px;
      margin: 20px auto 0;
      background-color: @light-gray-color;
    }
    .button {
      display: inline-block;
      width: 100px;
      margin: 20px;
      height: 30px;
      line-height: 30px;
      color: #fff;
      cursor: pointer;
      &.cancel-button {
        background-color: @light-font-color;
      }
      &.submit-button {
        background-color: @button-color;
      }
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
    }
  }
}
</style>
