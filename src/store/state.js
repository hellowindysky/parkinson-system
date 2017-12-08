const state = {
  lastOperationTime: (new Date()).getTime(),
  subjectId: parseInt(sessionStorage.getItem('subjectId'), 10)
};

export default state;
