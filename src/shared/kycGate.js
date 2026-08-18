/**
 * Shared KYC Gate Helper for Frontend Client Portal
 * 
 * Enforces that a user has a 'verified' or 'approved' KYC status before navigating
 * to protected workflows (such as opening a Live MT5 trading account).
 */

export const isKycApproved = (user) => {
  const status = (user?.kyc_status || user?.status || 'unverified').toLowerCase();
  return status === 'verified' || status === 'approved';
};

/**
 * Checks user KYC status. If unverified or pending, redirects to regulations/KYC page
 * and displays an alert message.
 * 
 * @param {Object} options - { user, navigate, onUnverified }
 * @returns {boolean} true if unverified (redirected/blocked), false if approved.
 */
export const redirectIfUnverifiedKyc = ({ user, navigate, onUnverified }) => {
  if (!isKycApproved(user)) {
    if (onUnverified && typeof onUnverified === 'function') {
      onUnverified('Complete KYC verification to open a live trading account.');
    }
    if (navigate && typeof navigate === 'function') {
      navigate('/kyc');
    }
    return true; // Blocked & Redirected
  }

  return false; // Approved, can proceed
};
