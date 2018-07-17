const state = {
  lastOperationTime: (new Date()).getTime(),

  subjectId: parseInt(sessionStorage.getItem('subjectId'), 10),

  hospitalType: parseInt(sessionStorage.getItem('hospitalType'), 10),

  // 这个变量代表是否已经通过“全部显示”的短信验证，不代表当前系统的实际脱敏与否
  hasRightToDisplaySensitiveInfo: false,

  // 表示是否显示脱敏字段，默认为“否”，即处于脱敏状态
  showSensitiveInfo: false,

  // 列表类型，默认为空
  listType: '',

  // 诊断里的 就诊时间 因为很多地方需要同步这个时间
  treatmentTime: '1970-01-02'
};

export default state;
