export default {

  // variables
  SUBJECT_ID_FOR_HOSPITAL: -1,

  EXPERIMENT_STEP_SCREENING: 2,
  EXPERIMENT_STEP_THERAPY: 3,
  EXPERIMENT_STEP_FOLLOW_UP: 4,
  EXPERIMENT_STEP_COMPLETE: 5,
  EXPERIMENT_STEP_OUT: -1,

  MAX_NO_OPERATION_TIME: 1000 * 60 * 60,

  // mode
  READING_MODE: 'reading',
  EDITING_MODE: 'editing',

  // scale mode
  SCALE_READING_MODE: 'scaleReading',
  SCALE_EDITING_MODE: 'scaleEditing',

  // status
  NORMAL_STATUS: 'normal',
  EXTENDED_STATUS: 'extended',

  // event
  UPDATE_USER_ID: 'updateUserId',
  UNSUBSCRIBE: 'unsubscribe',
  AUTHORIZED_BY_DOCTOR: 'authorizedByDoctor',
  DEPRIVED_OF_AUTHORITY_BY_DOCTOR: 'deprivedOfAuthorityByDoctor',

  SCREEN_SIZE_CHANGE: 'screenSizeChange',
  SHOW_LIST: 'showList',
  TOGGLE_LIST_DISPLAY: 'toggleListDisplay',
  TOGGLE_FILTER_PANEL_DISPLAY: 'toggleFilterPanelDisplay',
  TOGGLE_FOLDED_PANEL: 'toggleFoldedPanel',

  MOUNT_DYNAMIC_COMPONENT: 'mountDynamicComponent',
  DYNAMIC_COMPONENT_MOUNTED: 'dynamicComponentMounted',
  UNLOAD_DYNAMIC_COMPONENT: 'unloadDynamicComponent',

  FILTER_ALL: 'filterAll',
  FILTER_ARCHIVED: 'filterArchived',
  FILTER_UNARCHIVED: 'filterUnarchived',
  UPDATE_FILTER_CONDITION: 'updateFilterCondition',

  EDIT: 'edit',
  CANCEL: 'cancel',
  SUBMIT: 'submit',

  GIVE_UP: 'giveUpDecision',
  CONFIRM: 'confirmDecision',
  REQUEST_CONFIRMATION: 'requestConfirmation',
  NOTICE: 'notice',
  PERMIT_DISPLAYING_SENSITIVE_INFO: 'permitDisplayingSensitiveInfo',
  PERMIT_SUPPORT_THE_DOCTOR: 'permitSupportTheDoctor',

  ADD_DATA: 'addData',
  EDIT_DATA: 'editData',

  SCROLL_AREA_SIZE_CHANGE: 'scrollAreaSizeChange',
  ADD_NEW_CARD: 'addNewCard',
  VIEW_CURRENT_CARD: 'viewCurrentCard',
  EDIT_CURRENT_CARD: 'editCurrentCard',
  DELETE_CURRENT_CARD: 'deleteCurrentCard',
  RECALCULATE_CARD_WIDTH: 'recalculateCardWidth',

  MY_PATIENTS_TYPE: 'myPatients',
  OTHER_PATIENTS_TYPE: 'otherPatients',
  SUBJECT_PATIENTS_TYPE: 'subjectPatients',
  THERAPISTS_PATIENTS_TYPE: 'therapistsPatients',
  APPRAISERS_PATIENTS_TYPE: 'appraisersPatients',

  GROUP_TYPE: 'groups',
  USER_TYPE: 'users',
  ROLE_TYPE: 'roles',

  FOLD_BASIC_INFO: 'foldBasicInfo',
  EDIT_DISEASE_INFO: 'editDiseaseInfo',
  EDIT_OTHER_INFO: 'editOtherInfo',

  FOLD_DIAGNOSTIC_BASIC: 'foldDiagnosticBasic',
  EDIT_DIAGNOSTIC_DISEASE: 'editDiagnosticDisease',

  UPDATE_AUTHORIZED_STATUS: 'updateAuthorizedStatus',
  UPDATE_PATIENTS_LIST: 'updatePatientsList',
  UPDATE_GROUP_LIST: 'updateGroupList',
  UPDATE_PATIENT_INFO: 'updatePatientInfo',
  UPDATE_PATIENT_GROUP_INFO: 'updatePatientGroupInfo',
  UPDATE_PATIENT_SUBJECT_INFO: 'updatePatientSubjectInfo',
  UPDATE_CASE_INFO: 'updateCaseInfo',
  UPDATE_PATIENT_CASE_LIST: 'updatePatientCase',
  UPDATE_ITEM_POSITION: 'update_item_position',
  UPDATE_FIRSTSYMPTOMS_INFO: 'updateFirstsymptomsInfo',
  UPDATE_FIRSTTREATMENT_INFO: 'updateFirstTreatmentInfo',
  UPDATE_VISITDIAGNOSTICRECORD_INFO: 'updateVisitDiagnosticRecordInfo',
  UPDATE_COMPLAINTSYMPTOMS_INFO: 'updateComplaintSymptomsInfo',
  UPDATE_EXPERIMENT_INFO: 'updateExperimentInfo',

  BLUR_ON_SCREEN: 'blurOnScreen',

  HIDE_GROUP_PANEL: 'hideGroupPanel',
  HIDE_SUBJECT_PANEL: 'hideSubjectPanel',

  SHOW_SECRET_AGREEMENT_MODAL: 'showSecretAgreementModal',
  SHOW_GROUP_MODAL: 'showGroupModal',
  SHOW_MODAL_BOX: 'showModalBox',
  SHOW_SCALE_MODAL: 'showScaleModal',
  SHOW_MEDICINE_MODAL: 'showMedicineModal',
  SHOW_NEUROLOGIC_MODAL: 'showNeurologicModal',
  SHOW_GENE_MODAL: 'showGeneModal',
  SHOW_BIOCHEMICAL_EXAM_MODAL: 'showBiochemicalExamModal',
  SHOW_NEUROELECTRIC_MODAL: 'showNeuroelectricModal',
  SHOW_GAITPOSTURE_MODAL: 'showGaitPostureModal',
  SHOW_IMG_MODAL: 'showImgModal',
  SHOW_PRE_EVALUATION_MODAL: 'showPreEvaluationModal',
  SHOW_SURGICAL_METHOD_MODAL: 'showSurgicalMethodModal',
  SHOW_OPERATIVE_COMPLICATION_MODAL: 'showOperativeComplication',
  SHOW_DBS_MODAL: 'showDbsModal',
  SHOW_AUTHORIZATION_MODAL: 'showAuthorizationModal',
  SHOW_MESSAGE_MODAL: 'showMessageModal',
  SHOW_PASSWORD_MODAL: 'showPasswordModal',
  SHOW_PHYSIONTHERAPY_MODAL: 'showPhysiontherapyModal',
  SHOW_TREATMENT_EVALUATION_MODAL: 'showTreatmentEvaluationModal',
  SHOW_ADVERSE_EVENT_MODAL: 'showAdverseEventModal',
  SHOW_VITALSIGNS_MODAL: 'showVitalSignsModal',
  SHOW_FIRSTSYMPTOMS_MODAL: 'showFirstSymptomsModal',
  SHOW_FIRSTTREATMENT_MODAL: 'showFirstTreatmentModal',
  SHOW_DIAGNOSTIC_RECORD_MODAL: 'showDiagnosticRecordModal',
  SHOW_CHIEF_COMPLAINT_SYMPTOMS_MODAL: 'showChiefComplaintSymptomsModal',
  SHOW_APPLICATION_MODAL: 'showApplicationModal',
  SHOW_REJECTION_MODAL: 'showRejectionModal',
  SHOW_RATIFICATION_MODAL: 'showRatificationModal',
  SHOW_FOLLOW_UP_TERMINATION_MODAL: 'showFollowUpTerminationModal',
  SHOW_TERMINATION_MODAL: 'showTerminationModal',
  SHOW_EXPERIMENT_STEP_MODAL: 'showExperimentStepModal',

  SHOW_CHOICE_PANEL: 'showChoicePanel',

  QUIT_DIAGNOSTIC_DETAIL: 'quitDiagnosticDetail',

  // modal
  PRESENT_HISTORY_MODAL: 'presentHistoryModal',
  MEDICINE_HISTORY_MODAL: 'medicineHistoryModal',
  DISEASE_HISTORY_MODAL: 'diseaseHistoryModal',
  FAMILY_HISTORY_MODAL: 'familyHistoryModal',
  PERSON_HISTORY_MODAL: 'personHistoryModal',
  TOXIC_HISTORY_MODAL: 'toxicHistoryModal',
  PHYSIONTHERAPY_MODAL: 'PhysiontherapyModal',

  TEA_HISTORY_MODAL: 'teaHistoryModal',
  COFFEE_HISTORY_MODAL: 'coffeeHistoryModal',
  WINE_HISTORY_MODAL: 'wineHistoryModal',
  SMOKE_HISTORY_MODAL: 'smokeHistoryModal',
  EXERCISE_HISTORY_MODAL: 'exerciseHistoryModal'
};
