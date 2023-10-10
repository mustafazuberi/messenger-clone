interface FirebaseErrorCodes {
  [key: string]: string;
}

const firebaseErrorCodes: FirebaseErrorCodes = {
  "auth/claims-too-large":
    "The claims payload provided to setCustomUserClaims() exceeds the maximum allowed size of 1000 bytes.",
  "auth/email-already-exists":
    "The provided email is already in use by an existing user. Each user must have a unique email.",
  "auth/id-token-expired": "The provided Firebase ID token is expired.",
  "auth/id-token-revoked": "The Firebase ID token has been revoked.",
  "auth/insufficient-permission":
    "The credential used to initialize the Admin SDK has insufficient permission to access the requested Authentication resource. Refer to Set up a Firebase project for documentation on how to generate a credential with appropriate permissions and use it to authenticate the Admin SDKs.",
  "auth/invalid-argument":
    "An invalid argument was provided to an Authentication method. The error message should contain additional information.",
  "auth/invalid-creation-time":
    "The creation time must be a valid UTC date string.",
  "auth/invalid-disabled-field":
    "The provided value for the disabled user property is invalid. It must be a boolean.",
  "auth/invalid-credential": "Invalid Credential.",
  "auth/invalid-display-name":
    "The provided value for the displayName user property is invalid. It must be a non-empty string.",
  "auth/invalid-dynamic-link-domain":
    "The provided dynamic link domain is not configured or authorized for the current project.",
  "auth/invalid-email":
    "The provided value for the email user property is invalid. It must be a string email address.",
  "auth/invalid-email-verified":
    "The provided value for the emailVerified user property is invalid. It must be a boolean.",
  "auth/invalid-hash-algorithm":
    "The hash algorithm must match one of the strings in the list of supported algorithms.",
  "auth/invalid-hash-block-size": "The hash block size must be a valid number.",
  "auth/invalid-hash-derived-key-length":
    "The hash derived key length must be a valid number.",
  "auth/invalid-hash-key": "The hash key must be a valid byte buffer.",
  "auth/invalid-hash-memory-cost":
    "The hash memory cost must be a valid number.",
  "auth/invalid-hash-parallelization":
    "The hash parallelization must be a valid number.",
  "auth/invalid-hash-rounds": "The hash rounds must be a valid number.",
  "auth/invalid-hash-salt-separator":
    "The hashing algorithm salt separator field must be a valid byte buffer.",
  "auth/invalid-id-token":
    "The provided ID token is not a valid Firebase ID token.",
  "auth/invalid-last-sign-in-time":
    "The last sign-in time must be a valid UTC date string.",
  "auth/invalid-page-token":
    "The provided next page token in listUsers() is invalid. It must be a valid non-empty string.",
  "auth/invalid-password":
    "The provided value for the password user property is invalid. It must be a string with at least six characters.",
  "auth/invalid-password-hash":
    "The password hash must be a valid byte buffer.",
  "auth/invalid-password-salt":
    "The password salt must be a valid byte buffer.",
  "auth/invalid-phone-number":
    "The provided value for the phoneNumber is invalid. It must be a non-empty E.164 standard compliant identifier string.",
  "auth/invalid-photo-url":
    "The provided value for the photoURL user property is invalid. It must be a string URL.",
  "auth/invalid-provider-data":
    "The providerData must be a valid array of UserInfo objects.",
  "auth/invalid-provider-id":
    "The providerId must be a valid supported provider identifier string.",
  "auth/invalid-oauth-responsetype":
    "Only exactly one OAuth responseType should be set to true.",
  "auth/invalid-uid":
    "The provided uid must be a non-empty string with at most 128 characters.",
  "auth/invalid-user-import": "The user record to import is invalid.",
  "auth/maximum-user-count-exceeded":
    "The maximum allowed number of users to import has been exceeded.",
  "auth/missing-android-pkg-name":
    "An Android Package Name must be provided if the Android App is required to be installed.",
  "auth/missing-continue-uri":
    "A valid continue URL must be provided in the request.",
  "auth/missing-hash-algorithm":
    "Importing users with password hashes requires that the hashing algorithm and its parameters be provided.",
  "auth/missing-ios-bundle-id": "The request is missing a Bundle ID.",
  "auth/missing-uid": "A uid identifier is required for the current operation.",
  "auth/missing-oauth-client-secret":
    "The OAuth configuration client secret is required to enable OIDC code flow.",
  "auth/operation-not-allowed":
    "The provided sign-in provider is disabled for your Firebase project. Enable it from the Sign-in Method section of the Firebase console.",
  "auth/phone-number-already-exists":
    "The provided phoneNumber is already in use by an existing user. Each user must have a unique phoneNumber.",
  "auth/session-cookie-expired":
    "The provided Firebase session cookie is expired.",
  "auth/session-cookie-revoked":
    "The Firebase session cookie has been revoked.",
  "auth/too-many-requests":
    "The number of requests exceeds the maximum allowed.",
  "auth/uid-already-exists":
    "The provided uid is already in use by an existing user. Each user must have a unique uid.",
  "auth/unauthorized-continue-uri":
    "The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase Console.",
  "auth/user-not-found":
    "There is no existing user record corresponding to the provided identifier.",
};

export default firebaseErrorCodes;
