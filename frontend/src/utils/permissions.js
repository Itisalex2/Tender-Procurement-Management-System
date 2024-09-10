// Roles: 'admin', 'tenderer', 'tenderProcurementGroup', 'gjcWorker'

const permissionRoles = {
  modifyBackend: ['admin'],
  createTender: ['admin', 'tenderProcurementGroup'],
  viewAllTenders: ['admin', 'tenderProcurementGroup'],
  manageTenders: ['admin', 'tenderProcurementGroup'],
  editTender: ['admin', 'tenderProcurementGroup'],
  includeInTenderTargetedUsers: ['tenderer', 'gjcWorker'],
  submitBid: ['tenderer'],
  messageOnAllTenders: ['admin', 'tenderProcurementGroup'],
};

module.exports = permissionRoles;
