// Roles: 'admin', 'supplier', 'tenderProcurementGroup', 'gjcWorker'

const permissionRoles = {
  modifyBackend: ['admin'],
  createTender: ['admin', 'tenderProcurementGroup'],
  viewAllTenders: ['admin', 'tenderProcurementGroup'],
  manageTenders: ['admin', 'tenderProcurementGroup'],
  editTender: ['admin', 'tenderProcurementGroup'],
  includeInTenderTargetedUsers: ['supplier', 'gjcWorker'],
};

module.exports = permissionRoles;
