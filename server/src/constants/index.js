const ROLES = {
  STUDENT:   'student',
  ORGANIZER: 'organizer',
  FACULTY:   'faculty',
  ADMIN:     'admin',
};

const EVENT_STATUS = {
  PENDING:   'pending',
  APPROVED:  'approved',
  REJECTED:  'rejected',
  ONGOING:   'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const REGISTRATION_STATUS = {
  REGISTERED: 'registered',
  CANCELLED:  'cancelled',
  ATTENDED:   'attended',
};

module.exports = { ROLES, EVENT_STATUS, REGISTRATION_STATUS };