<template lang="html">
  <div class="secret-agreement-modal-wrapper" v-show="displayModal">
    <div class="secret-agreement-modal" ref="scrollArea">
      <div class="title">睿云-帕金森病数据管理及智能分析系统保密协议</div>
      <div class="content">
        <p class="text">本协议由：</p>
        <p class="text underline">披露方：{{orgName}}  {{accountName}}（“名称”），联系方式为 {{accountNumber}}</p>
        <p class="text underline">接收方：深圳市臻络科技有限公司 （“公司名称”），公司注册地为 深圳市南山区高新区南区粤兴三道9号华中科技大学深圳产学研基地A栋805</p>
        <p class="text">本协议为“睿云-帕金森病数据管理及智能分析系统”保密协议：医院及医院指定的使用“睿云-帕金森病数据管理及智能分析系统”的医生为披露保密信息的一方，简称为“披露方”，主要使用“睿云-帕金森病数据管理及智能分析系统”，管理临床帕金森病人；深圳市臻络科技有限公司接收保密信息的一方，简称为“接收方”，主要负责为医生使用睿云平台提供技术支持以及后期提供数据管理分析服务。协议正文披露方或接收方也可称为“一方”，或统称为“双方”。双方就保守保密信息的秘密一事达成如下协议：</p>

        <p class="sub-title">1.保密信息</p>
        <p class="text">1.1睿云病例保密信息即录入到“睿云-帕金森病数据管理及智能分析系统”的病例信息，包括但不限于病人的个人基本信息、病史、病情现状等。披露此类保密信息的方式包括但不限于信函、传真、备忘录、纪要、协议、合同、报告、手册、软件代码、图纸、电子邮件等，或以口头方式披露并以书面方式确认为保密信息。</p>
        <p class="text">1.2睿云病例保密信息若以书面形式披露给接收方，则披露方应在其上标明披露方名称、披露日期及“保密”或类似字样。保密信息若首先以口头等其他非书面方式披露，交付给接收方，接收方同样遵守保密协议。</p>
        <p class="text">1.3保密信息不包括如下信息：（1）已成为公知信息，而接收方对此并无过错；或（2）披露方提供的信息接收方已经知晓的信息；或（3）接收方从第三方合法获得的信息，且未附加保密的义务；或（4）披露方事先书面同意对外披露或任意第三方使用的信息；或（5）未根据1.2款的约定标明“保密”或确认其保密性质的信息。</p>

        <p class="sub-title">2.使用限制</p>
        <p class="text">2.1任何一方均不应向第三方披露或公开宣称如下事项：（1）双方正在或即将进行某种磋商、或双方缔结某种合作关系的可能性；或（2）双方即将缔结、或已缔结、或已终止某种合作关系。</p>
        <p class="text">2.2未经披露方及信息所有权人同意，接受方不得使用披露方在睿云平台披露的信息。</p>

        <p class="sub-title">3.独立的缔约人</p>
        <p class="text">本协议下披露方及接收方是独立的缔约人，本协议所载任何内容不应被解释为在披露方与接收方间创设合资、合伙、雇佣、代理或任何其它协议目的之外的关系。</p>

        <p class="sub-title">4.适用法律及争议解决</p>
        <p class="text">本协议应受中华人民共和国法律解释和管辖，且不考虑法律冲突。有关本协议的任何争议应由双方秉承善意友好协商解决。若三十日内协商不成，双方同意将争议提交深圳仲裁委员会依据其规则仲裁解决。仲裁裁决是终局的，对双方均有法律拘束力。如发生不可预知的因素如接收方破产，披露方有权利通过法律手段维护自身权益，保障披露方睿云病例信息安全。</p>

        <p class="sub-title">5.修改</p>
        <p class="text">未经双方书面同意，本协议不得修改。任何根据本条款作出的修改对双方及各自的义务继受者均有法律约束力。</p>

        <p class="sub-title">6.转让</p>
        <p class="text">未经对方事先书面同意，任一方不得转让其在本协议下的任何权利或义务。</p>

        <p class="sub-title">7.期限</p>
        <p class="text">本协议应自签订合同生效日起生效，本协议约定的保密义务10年有效，在有效期限到期1年内经双方协商续签保密协议。</p>

        <p class="sub-title">8.文本</p>
        <p class="text">本协议一式二份，双方各执一份，均具有同等法律效力。</p>
      </div>
      <div class="seperate-line"></div>
      <div class="button" @click="hideModal">确定</div>
    </div>
  </div>
</template>

<script>
import Ps from 'perfect-scrollbar';
import Bus from 'utils/bus.js';

export default {
  data() {
    return {
      displayModal: false
    };
  },
  computed: {
    orgName() {
      var orgName = sessionStorage.getItem('orgName');
      return orgName ? orgName : '';
    },
    accountName() {
      var name = sessionStorage.getItem('name');
      return name ? name : '';
    },
    accountNumber() {
      var accountNumber = sessionStorage.getItem('accountNumber');
      return accountNumber ? accountNumber : '';
    }
  },
  methods: {
    showModal() {
      this.displayModal = true;
    },
    hideModal() {
      this.displayModal = false;
    },
    updateScrollbar() {
      this.$nextTick(() => {
        Ps.destroy(this.$refs.scrollArea);
        Ps.initialize(this.$refs.scrollArea, {
          wheelSpeed: 1,
          minScrollbarLength: 40,
          suppressScrollX: true
        });
      });
    }
  },
  mounted() {
    Bus.$on(this.SHOW_SECRET_AGREEMENT_MODAL, this.showModal);
    this.updateScrollbar();
  }
};
</script>

<style lang="less">
@import "~styles/variables.less";

.secret-agreement-modal-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: fadeout(@light-font-color, 30%);
  z-index: 800;
  .secret-agreement-modal {
    position: relative;
    margin: auto;
    padding: 20px 40px;
    top: 8%;
    max-height: 80%;
    width: 600px;
    background-color: @background-color;
    overflow: hidden;
    .title {
      margin: 10px auto 30px;
      font-size: @large-font-size;
      font-weight: bold;
    }
    .content {
      text-align: left;
      font-size: @normal-font-size;
      .sub-title {
        margin: 25px 0 15px;
        line-height: 30px;
        font-weight: 500;
      }
      .text {
        line-height: 20px;
        white-space: pre-wrap;
      }
      .underline {
        text-decoration: underline;
      }
    }
    .seperate-line {
      width: 90%;
      height: 1px;
      margin: 10px auto;
      background-color: @light-gray-color;
    }
    .button {
      margin: 10px auto 0;
      width: 120px;
      height: 30px;
      line-height: 30px;
      background-color: @button-color;
      color: #fff;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.9;
      }
    }
    .ps__scrollbar-y-rail {
      position: absolute;
      width: 15px;
      right: 0;
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
  }
}
</style>
