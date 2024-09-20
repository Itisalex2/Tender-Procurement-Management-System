const en = {
  // Status
  admin: 'Admin',
  tenderer: 'Tenderer',
  tenderProcurementGroup: 'Tender Procurement Group',
  secretary: 'Secretary',

  // Bid status:
  negotiationCandidate: 'Negotiation Candidate',
  lost: 'Lost',
  pending: 'Pending',

  // Navbar translations
  procurementManagement: 'Procurement Management',
  home: 'Home',
  viewOwnBids: 'View My Bids',
  createTender: 'Create Tender',
  manageTenders: 'Manage Tenders',
  tenderersDatabase: 'Supplier Database',
  adminSettings: 'Admin Settings',
  createTenderer: 'Create Tenderer',
  settings: 'Settings',
  logout: 'Logout',
  login: 'Login',
  signup: 'Signup',

  // AddTenderer page translations
  addTendererTitle: 'Create Tenderer (Password Generated Randomly)',
  usernameLabel: 'Username',
  emailLabel: 'Email Address',
  phoneLabel: 'Phone Number',
  submitButton: 'Create Tenderer',
  submittingButton: 'Creating...',
  successMessage: 'Tenderer created successfully!',
  failureMessage: 'Failed to add tenderer',

  // AdminSettings page translations
  manageUsers: 'Manage Users',
  addUser: 'Add User',
  cancelAddUser: 'Cancel Add User',
  fetchingUsers: 'Fetching users...',
  error: 'Error',
  confirmDelete: 'Are you sure you want to delete this user? This action cannot be undone.',
  failedToAddUser: 'Failed to add user',
  failedToUpdateUser: 'Failed to update user',
  failedToDeleteUser: 'Failed to delete user',
  searchByUsername: 'Search by username...',

  // CreateTender page translations
  createTenderError: 'Failed to create tender',
  tenderCreated: 'Tender created successfully!',
  confirmCreateTender: 'Confirm Create Tender',
  confirmCreateTenderBody: 'Are you sure you want to create this tender?',
  cancel: 'Cancel',
  confirm: 'Confirm',
  title: 'Title',
  description: 'Description',
  issueDate: 'Issue Date',
  closingDate: 'Closing Date',
  contactName: 'Contact Name',
  contactEmail: 'Contact Email',
  contactPhone: 'Contact Phone',
  otherRequirements: 'Other Requirements',
  selectTargetedUsers: 'Select Targeted Users',
  selectProcurementGroup: 'Select Procurement Group',
  loading: 'Loading...',
  fetchUsersError: 'Error fetching users: {0}',
  invalidPhoneNumber: 'Invalid phone number',

  // EditTender page translations
  editTender: 'Edit Tender',
  updateTender: 'Update Tender',
  updateTenderError: 'Failed to update tender',
  tenderUpdatedSuccess: 'Tender updated successfully!',
  tenderUpdating: 'Updating Tender...',
  existingFiles: 'Existing Files',
  uploadedOn: 'Uploaded On',
  uploadedBy: 'Uploaded By',
  fetchError: 'Error: {0}',

  // Home page translations
  tenderList: 'Tender List',
  status: 'Status',
  relatedFiles: 'Related Files',
  noFiles: 'No related files',

  // Inbox page translations
  mails: 'Mails',
  selectAll: 'Select All',
  markAsRead: 'Mark as Read',
  markAsUnread: 'Mark as Unread',
  delete: 'Delete',
  noMails: 'No mails available',
  subject: 'Subject',
  sender: 'Sender',
  content: 'Content',
  viewTender: 'View Tender',
  viewBid: 'View Bid',
  errorMarkingMail: 'Error marking mail as read/unread',
  errorDeletingMail: 'Error deleting mails',
  errorFetchingTender: 'Error fetching tender',
  selectNegotiationCandidateBidSubject: 'Your bid has been selected as a negotiation candidate',
  selectNegotiationCandidateBidContent: 'Your bid has been selected as a negotiation candidate. Please view the tender details for more information.',
  deselectNegotiationCandidateBidSubject: 'Sorry! Your bid has been deselected as a negotiation candidate',
  deselectNegotiationCandidateBidContent: 'Sorry! Your bid has been deselected as a negotiation candidate. Please view the tender details for more information.',

  // Login page translations
  email: 'Email',
  password: 'Password',
  phoneNumber: 'Phone Number',
  verificationCode: 'Verification Code',
  verificationSent: 'Verification code sent!',
  sendVerificationCode: 'Send Verification Code',
  loginWithCode: 'Login with Code',
  loginSuccess: 'Login successful!',
  loginFailed: 'Login failed!',
  sendVerificationError: 'Failed to send verification code',
  useEmailLogin: 'Use Email Login',
  usePhoneLogin: 'Use Phone Login',
  emailPasswordIncorrect: 'Email or password is incorrect',
  allFieldsRequired: 'All fields are required',

  // Logout translations
  failedToLogout: 'Failed to log out:',

  // ManageTenderers page translations
  unableToFetchTenderers: 'Unable to fetch tenderers',
  searchCompany: 'Search by company name...',
  all: 'All',
  verified: 'Verified',
  nonVerified: 'Non-Verified',
  companyName: 'Company Name',
  businessType: 'Business Type',
  legalRepresentative: 'Legal Representative',
  country: 'Country',
  actions: 'Actions',
  notProvided: 'Not Provided',
  viewDetails: 'View Details',
  noTenderersFound: 'No tenderers found matching the criteria',
  changeStatusToNegotiationCandidatesSelected: 'Change Status to Negotiation Candidates Selected',
  failedToChangeStatus: 'Failed to change status',
  statusChangedToNegotiationCandidatesSelected: 'Status changed to Negotiation Candidates Selected',
  errorChangingStatus: 'Error changing status:',

  // ManageTenders page translations
  filterTenderStatus: 'Filter Tender Status',
  allStatus: 'All Statuses',
  Open: 'Open',
  Closed: 'Closed',
  ClosedAndCanSeeBids: 'Closed (Bids Viewable)',
  NegotiationCandidatesSelected: 'Negotiation candidates selected',
  Failed: 'Failed',
  searchKeyword: 'Search Keyword',
  searchPlaceholder: 'Search title or description...',
  noTenders: 'No tenders available',
  contact: 'Contact',
  edit: 'Edit',
  alreadyConfirmed: 'Already Confirmed',
  confirmToSeeBids: 'Confirm to View Bids',
  viewBids: 'View Bids',
  targetedUsers: 'Targeted Users',
  bidders: 'Bidders',
  procurementGroupMembers: 'Procurement Group Members',
  confirmDeleteTender: 'Are you sure you want to delete this tender?',
  failedToDeleteTender: 'Failed to delete tender',
  failedToConfirmBidViewing: 'Failed to confirm bid viewing',
  errorConfirmingBidViewing: 'Error confirming bid viewing:',

  // PageNotFound page translations
  pageNotFound: '404 Error: page not found',

  // Settings page translations
  failedToUpdateSettings: 'Failed to update settings',
  personalSettings: 'Personal Settings',
  basicInformation: 'Basic Information',
  settingsUpdatedSuccess: 'Settings updated successfully!',
  username: 'Username',
  role: 'Role',
  emailAddress: 'Email Address',
  saving: 'Saving...',
  saveChanges: 'Save Changes',
  companyDetails: 'Company Details',
  companyDetailsSavedSuccess: 'Company details saved successfully!',

  // SignUp page translations
  supplierSignup: 'Supplier Signup',
  supplierName: 'Supplier Name',
  incorrectEmailFormat: 'Incorrect email format',
  emailAlreadyExists: 'Email already exists',
  passwordNotStrongEnough: 'Password is not strong enough. Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.',

  // SubmitBid page translations
  noPermissionToSubmitBid: 'You do not have permission to submit a bid.',
  submitBidFailed: 'Failed to submit bid',
  submitBid: 'Submit Bid',
  updateCompanyInfoToBid: 'You have not updated your company information. Please update your company details before submitting a bid.',
  updateCompanyInfo: 'Update Company Information',
  bidSubmittedSuccess: 'Bid submitted successfully!',
  bidAmount: 'Bid Amount',
  additionalInformation: 'Additional Information',
  cannotSubmitBid: 'Cannot submit bid',

  // ViewBid page translations
  unableToFetchBid: 'Unable to fetch bid.',
  noPermissionToViewBid: 'You do not have permission to view this bid.',
  bidDetails: 'Bid Details',
  supplier: 'Supplier',
  bidContent: 'Bid Content',
  none: 'None',
  bidFiles: 'Bid Files',
  noBidFiles: 'No bid files',
  submittedAt: 'Submitted At',

  // ViewBids page translations
  unableToSelectNegotiationCandidateBid: 'Unable to select negotation candidate.',
  negotiationCandidateBidSelected: 'Negotiation candidate selected successfully!',
  failedToSelectNegotiationCandidateBid: 'Failed to select negotiation candidate.',
  noPermissionToViewBids: 'You are not authorized to view bids because bids are not yet public.',
  unableToFetchBids: 'Unable to fetch bids.',
  bidList: 'Bid List',
  noBids: 'No bids.',
  selectAsNegotiationCandidateBid: 'Select as Negotiation Candidate Bid',
  unableToRemoveNegotiationCandidateBid: 'Unable to remove negotiation candidate bid.',
  negotiationCandidateBidRemoved: 'Negotiation candidate bid removed successfully!',
  failedToRemoveNegotiationCandidateBid: 'Failed to remove negotiation candidate bid.',
  removeFromNegotiationCandidateList: 'Remove from Negotiation Candidate List',

  // ViewOwnBids page translations
  noBidsSubmitted: 'You have not submitted any bids.',
  myBids: 'My Bids',
  bidInformation: 'Bid Information',

  // ViewTender page translations
  uploadedAt: 'Uploaded At',

  // ViewTenderer page translations
  unableToLoadTenderer: 'Unable to load tenderer',
  tendererDetailsNotFound: 'Tenderer details not found.',
  cannotViewNonTenderer: 'Cannot view non-tenderer user.',
  tendererDetails: 'Tenderer Details',
  phone: 'Phone',
  bids: 'Bids',
  tender: 'Tender',
  noCompanyDetailsCannotComment: 'No company details submitted, cannot comment.',
  dateOfEstablishment: 'Date of Establishment',
  officeAddress: 'Office Address',
  unifiedSocialCreditCode: 'Unified Social Credit Code',
  verificationStatus: 'Verification Status',
  processing: 'Processing...',
  verifyTenderer: 'Verify Tenderer',
  unverifyTenderer: 'Unverify Tenderer',
  businessLicense: 'Business License',
  legalRepresentativeBusinessCard: 'Legal Representative Business Card',
  download: 'Download',
  comments: 'Comments',
  noComments: 'No comments.',
  unknownUser: 'Unknown User',
  addComment: 'Add Comment',
  submitting: 'Submitting...',
  submitComment: 'Submit Comment',

  // AddUserForm translations
  addNewUser: 'Add New User',
  addingUser: 'Adding...',

  // Bid-Evaluations translations
  unableToSubmitEvaluation: 'Unable to submit evaluation',
  evaluationSubmittedSuccessfully: 'Evaluation submitted successfully!',
  evaluations: 'Evaluations',
  evaluator: 'Evaluator',
  score: 'Score',
  feedback: 'Feedback',
  noEvaluations: 'No evaluations',
  addEvaluation: 'Add Evaluation',
  submitEvaluation: 'Submit Evaluation',

  // Chatbox translations
  closeChat: 'Close Q&A',
  openChat: 'Open Q&A',
  selectConversation: 'Select Conversation',
  conversationWith: 'Conversation with',
  noDiscussions: 'No discussions',
  enterYourAnswer: 'Enter your answer...',
  sending: 'Sending...',
  send: 'Send',
  questionsAndDiscussions: 'Questions and Discussions',
  enterYourQuestion: 'Enter your question...',
  failedToSendMessage: 'Failed to send message',

  // File-Upload translations
  invalidFileType:
    'Invalid file type. Only JPEG, PNG, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, RTF, ZIP, RAR, DWG, and DXF are accepted.',
  fileTooLarge: 'File exceeds 1GB.',
  selected: 'Selected',

  // Tenderer-Details-Form translations
  allowedFileTypes: 'Only JPG, PNG, or PDF files are allowed.',
  fileSizeLimit: 'File size cannot exceed 5MB.',
  failedToUpdateDetails: 'Failed to update tenderer details',
  businessLicenseLabel: 'Business License (jpg, png, pdf) Max 5MB',
  currentFile: 'Current File',
  downloadBusinessLicense: 'Download Business License',
  legalRepBusinessCardLabel: 'Legal Representative Business Card (jpg, png, pdf) Max 5MB',
  downloadLegalRepBusinessCard: 'Download Legal Representative Business Card',
  saveCompanyDetails: 'Save Company Details',

  // User-List translations
  confirmSaveAllChanges: 'Are you sure you want to save all changes?',
  filterUserRole: 'Filter User Role',
  allRoles: 'All Roles',
  updatePassword: 'Update Password',
  deleteUser: 'Delete User',
  saveAllChanges: 'Save All Changes',

  // use-fetch-all-users translations
  failedToFetchUsers: 'Failed to fetch users',

  // File-Upload translations
  addFile: 'Add File',
};

export default en;