const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Triggered when a Vendor document is updated
 */
exports.onVendorStatusUpdated = onDocumentUpdated("vendors/{vendorId}", async (event) => {
  const newValue = event.data.after.data();
  const previousValue = event.data.before.data();

  // Check if the status field actually changed
  if (newValue.status === previousValue.status) {
    return null;
  }

  // Get the device token for the vendor (assuming you save it when they log in)
  const deviceToken = newValue.fcmToken;
  if (!deviceToken) {
    console.log(`No FCM token found for vendor ${event.params.vendorId}`);
    return null;
  }

  let title = "Account Update";
  let body = "There was an update to your account.";

  // Customize the message based on the new status
  if (newValue.status === "active") {
    title = "Account Approved! 🎉";
    body = "Your vendor account has been approved and activated. You can now start receiving orders!";
  } else if (newValue.status === "suspended") {
    title = "Account Suspended ⚠️";
    body = `Your account has been suspended. Reason: ${newValue.suspensionReason || "Violation of terms"}. Contact support.`;
  } else {
    // If it changed to something else, you might optionally not send a notification
    title = "Account Status Changed";
    body = `Your account status is now: ${newValue.status}.`;
  }

  const message = {
    token: deviceToken,
    notification: {
      title: title,
      body: body,
    },
    data: {
      type: "status_update",
      status: newValue.status
    }
  };

  try {
    await admin.messaging().send(message);
    console.log(`Successfully sent notification to vendor ${event.params.vendorId}`);
  } catch (error) {
    console.error("Error sending FCM notification:", error);
  }
});

/**
 * Triggered when a Rider document is updated
 */
exports.onRiderStatusUpdated = onDocumentUpdated("riders/{riderId}", async (event) => {
  const newValue = event.data.after.data();
  const previousValue = event.data.before.data();

  // In riders collection, it's called 'accountStatus'
  if (newValue.accountStatus === previousValue.accountStatus) {
    return null;
  }

  const deviceToken = newValue.fcmToken;
  if (!deviceToken) {
    return null;
  }

  let title = "Account Update";
  let body = "";

  if (newValue.accountStatus === "active") {
    title = "You're Approved to Ride! 🏍️";
    body = "Your rider profile is active. You can start accepting delivery requests.";
  } else if (newValue.accountStatus === "suspended") {
    title = "Account Suspended ⚠️";
    body = "Your rider account has been temporarily suspended.";
  }

  if(!body) return null; // Don't send if we didn't specify a body

  try {
    await admin.messaging().send({
      token: deviceToken,
      notification: { title, body }
    });
  } catch (error) {
    console.error("Error sending FCM to rider:", error);
  }
});
