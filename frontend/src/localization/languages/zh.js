const zh = {
  // Role
  admin: '管理员',
  tenderer: '供应商',
  tenderProcurementGroup: '招标管理组',
  secretary: '招标秘书',

  // Bid status:
  won: '中标',
  lost: '为中标',
  pending: '审核中',

  // Navbar translations
  procurementManagement: '招采管理',
  home: '首页',
  viewOwnBids: '查看我的投标',
  createTender: '创建招标',
  manageTenders: '招标管理',
  tenderersDatabase: '供应商库',
  adminSettings: '后台管理',
  createTenderer: '创建供应商',
  settings: '设置',
  logout: '登出',
  login: '登录',
  signup: '报名',

  // AddTenderer page translations
  addTendererTitle: '创建供应商(密码随机生成)',
  usernameLabel: '企业名',
  emailLabel: '邮件地址',
  phoneLabel: '电话号码',
  submitButton: '添加供应商',
  submittingButton: '添加中...',
  successMessage: '供应商创建成功！',
  failureMessage: '添加供应商失败',

  // AdminSettings page translations
  manageUsers: '管理用户',
  addUser: '添加用户',
  cancelAddUser: '取消添加用户',
  fetchingUsers: '下载中...',
  error: '错误',
  confirmDelete: '您确定要删除这位用户吗?这个操作无法撤销。',
  failedToAddUser: '添加用户失败',
  failedToUpdateUser: '更新用户失败',
  failedToDeleteUser: '删除用户失败',
  searchByUsername: '搜索用户名...',

  // CreateTender page translations
  createTenderError: '没有成功创建招标',
  tenderCreated: '招标创建成功！',
  confirmCreateTender: '确认创建招标',
  confirmCreateTenderBody: '您确定要创建这个招标吗？',
  cancel: '取消',
  confirm: '确认',
  title: '标题',
  description: '描述',
  issueDate: '发布日期',
  closingDate: '截止日期',
  contactName: '联系人姓名',
  contactEmail: '联系人邮箱',
  contactPhone: '联系人电话',
  otherRequirements: '其他要求',
  selectTargetedUsers: '选择目标用户',
  selectProcurementGroup: '选择招标小组成员',
  loading: '加载中...',
  fetchUsersError: '获取用户时出错: {0}',
  invalidPhoneNumber: '电话号码格式不正确',

  // EditTender page translations
  editTender: '编辑招标',
  updateTender: '更新招标',
  updateTenderError: '更新招标失败',
  tenderUpdatedSuccess: '招标更新成功！',
  existingFiles: '现有文件',
  uploadedOn: '上传时间',
  uploadedBy: '上传者',
  fetchError: '错误: {0}',

  // Home page translations
  tenderList: '招标列表',
  status: '状态',
  relatedFiles: '相关文件',
  noFiles: '无相关文件',

  // Inbox page translations
  mails: '邮件',
  selectAll: '全选',
  markAsRead: '标记已读',
  markAsUnread: '标记未读',
  delete: '删除',
  noMails: '无邮件',
  subject: '主题',
  sender: '发件人',
  content: '内容',
  viewTender: '查看招标',
  viewBid: '查看投标',
  errorMarkingMail: '标记邮件时出错',
  errorDeletingMail: '删除邮件时出错',
  errorFetchingTender: '获取招标信息时出错',

  // Login page translations
  email: '邮件',
  password: '密码',
  phoneNumber: '电话号码',
  verificationCode: '验证码',
  verificationSent: '验证码已发!',
  sendVerificationCode: '发送验证码',
  loginWithCode: '验证码登陆',
  loginSuccess: '登陆成功！',
  loginFailed: '登陆失败',
  sendVerificationError: '没有发出验证码',
  useEmailLogin: '使用邮件登录',
  usePhoneLogin: '使用电话号码登录',
  emailPasswordIncorrect: '邮件或密码不正确',
  allFieldsRequired: '所有字段必须填写',

  // Logout translations
  failedToLogout: '登出失败:',

  // ManageTenderers page translations
  unableToFetchTenderers: '无法获取供应商列表',
  searchCompany: '搜索企业名称...',
  all: '全部',
  verified: '已验证',
  nonVerified: '未验证',
  companyName: '企业名称',
  businessType: '企业类型',
  legalRepresentative: '法定代表人',
  country: '国家',
  actions: '操作',
  notProvided: '未提供',
  viewDetails: '查看详情',
  noTenderersFound: '未找到符合条件的供应商',

  // ManageTenders page translations
  filterTenderStatus: '筛选招标状态',
  allStatus: '所有状态',
  Open: '开放',
  Closed: '关闭',
  ClosedAndCanSeeBids: '关闭可查看投标',
  Awarded: '已授予',
  Failed: '流标',
  searchKeyword: '搜索关键字',
  searchPlaceholder: '搜索标题或描述...',
  noTenders: '无招标项目',
  contact: '联系',
  edit: '编辑',
  alreadyConfirmed: '已确认',
  confirmToSeeBids: '确认查看投标',
  viewBids: '查看投标',
  targetedUsers: '目标用户',
  bidders: '投标者',
  procurementGroupMembers: '采购组成员',
  confirmDeleteTender: '您确定要删除这个招标吗？',
  failedToDeleteTender: '删除招标失败',
  failedToConfirmBidViewing: '确认查看投标失败',
  errorConfirmingBidViewing: '确认查看投标时出错：',

  // PageNotFound page translations
  pageNotFound: '404错误：页面未找到',

  // Settings page translations
  failedToUpdateSettings: '更新设置失败',
  personalSettings: '个人设置',
  basicInformation: '基本信息',
  settingsUpdatedSuccess: '设置改变成功!',
  username: '用户名',
  role: '角色',
  emailAddress: '邮件地址',
  saving: '保存中...',
  saveChanges: '保存更改',
  companyDetails: '企业详情',
  companyDetailsSavedSuccess: '企业详情已保存成功!',

  // SignUp page translations
  supplierSignup: '供应商报名',
  supplierName: '供应商名',
  incorrectEmailFormat: '邮件格式不正确',
  emailAlreadyExists: '邮件地址已存在',
  passwordNotStrongEnough: '密码不符合要求. 请至少包含一个大写字母，一个小写字母，一个数字和一个特殊字符。',

  // SubmitBid page translations
  noPermissionToSubmitBid: '您没有权限提交投标。',
  submitBidFailed: '提交投标失败',
  submitBid: '提交投标',
  updateCompanyInfoToBid:
    '您还未更新您的企业资料。请先更新您的企业信息以提交投标。',
  updateCompanyInfo: '更新企业资料',
  bidSubmittedSuccess: '投标提交成功！',
  bidAmount: '投标金额',
  additionalInformation: '附加信息',
  cannotSubmitBid: '无法提交投标',

  // ViewBid page translations
  unableToFetchBid: '无法获取投标。',
  noPermissionToViewBid: '您没有权限查看这个投标。',
  bidDetails: '投标详情',
  supplier: '供应商',
  bidContent: '投标信息',
  none: '无',
  bidFiles: '投标文件',
  noBidFiles: '无投标文件',
  submittedAt: '提交时间',

  // ViewBids page translations
  unableToSelectWinningBid: '无法选择中标投标。',
  winningBidSelected: '中标投标已成功选择！',
  failedToSelectWinningBid: '选择中标投标失败。',
  noPermissionToViewBids: '您无权查看投标，因为投标尚未公开。',
  unableToFetchBids: '无法获取投标。',
  bidList: '投标列表',
  noBids: '没有投标。',
  selectAsWinningBid: '选择为中标',

  // ViewOwnBids page translations
  noBidsSubmitted: '您没有提交任何投标。',
  myBids: '我的投标',
  amount: '金额',
  bidInformation: '投标信息',

  // ViewTender page translations
  uploadedAt: '上传时间',

  // ViewTenderer page translations
  unableToLoadTenderer: '无法加载供应商',
  tendererDetailsNotFound: '未找到供应商详情。',
  cannotViewNonTenderer: '无法查看非供应商用户。',
  tendererDetails: '供应商详情',
  phone: '电话',
  tender: '标',
  noCompanyDetailsCannotComment: '未提交企业资料，无法评论。',
  dateOfEstablishment: '成立日期',
  officeAddress: '办公地址',
  unifiedSocialCreditCode: '统一社会信用代码',
  verificationStatus: '验证状态',
  processing: '处理中...',
  verifyTenderer: '验证供应商',
  unverifyTenderer: '取消验证',
  businessLicense: '营业执照',
  legalRepresentativeBusinessCard: '法人名片',
  download: '下载',
  comments: '评论',
  noComments: '无评论',
  unknownUser: '未知用户',
  addComment: '添加评论',
  submitting: '提交中...',
  submitComment: '提交评论',

  // AddUserForm translations
  addNewUser: '添加新用户',
  addingUser: '添加中...',

  // Bid-Evaluations translations
  unableToSubmitEvaluation: '无法提交评估',
  evaluationSubmittedSuccessfully: '评估成功提交！',
  evaluations: '评估',
  evaluator: '评估者',
  score: '评分',
  feedback: '反馈',
  noEvaluations: '无评估',
  addEvaluation: '添加评估',
  submitEvaluation: '提交评估',

  // Chatbox translations
  closeChat: '关闭招标答疑',
  openChat: '打开招标答疑',
  selectConversation: '选择会话',
  conversationWith: '会话与',
  noDiscussions: '暂无讨论',
  enterYourAnswer: '输入您的解答...',
  sending: '发送中...',
  send: '发送',
  questionsAndDiscussions: '问题与讨论',
  enterYourQuestion: '输入您的问题...',
  failedToSendMessage: '发送消息失败',

  // File-Upload translations
  invalidFileType:
    '文件类型不符合。只接受 JPEG、PNG、PDF、DOC、DOCX、XLS、XLSX、PPT、PPTX、TXT、RTF、ZIP、RAR、DWG 和 DXF。',
  fileTooLarge: '文件超过 1GB。',
  selected: '选择了',

  // Tenderer-Details-Form translations
  allowedFileTypes: '只允许上传 JPG、PNG 或 PDF 文件。',
  fileSizeLimit: '文件大小不能超过 5MB。',
  failedToUpdateDetails: '更新企业详情失败',
  businessLicenseLabel: '营业执照 (jpg, png, pdf) 5MB 上限',
  currentFile: '当前文件',
  downloadBusinessLicense: '下载营业执照',
  legalRepBusinessCardLabel: '法人名片 (jpg, png, pdf) 5MB 上限',
  downloadLegalRepBusinessCard: '下载法人名片',
  saveCompanyDetails: '保存企业详情',

  // User-List translations
  confirmSaveAllChanges: '您确定要保存所有更改吗?',
  filterUserRole: '筛选用户角色',
  allRoles: '所有角色',
  updatePassword: '更新密码',
  deleteUser: '删除用户',
  saveAllChanges: '保存所有更改',

  // use-fetch-all-users translations
  failedToFetchUsers: '无法获取用户',
};

export default zh;