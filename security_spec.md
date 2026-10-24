# Security Specification: ThriftFit DuvALL Firestore Rules

## 1. Data Invariants
1. **Store Authorization**: Only authenticated administrators (`isAdmin()`) can create, update, or delete store records. Public users can only read stores where `published == true`.
2. **Admin Bootstrapping**: `vexijbg@gmail.com` is verified by runtime metadata and granted administrative access alongside registered `/admins/{adminId}` documents.
3. **Review Moderation**: Public users can read approved reviews (`status == 'approved'`). Only administrators can change review status to `'hidden'` or `'approved'`, or delete reviews.
4. **ID Sanitization**: Document path IDs must adhere to `isValidId()` (regex `^[a-zA-Z0-9_\-]+$`, max 128 characters) to prevent injection and resource poisoning.
5. **Payload Constraining**: String lengths, numeric boundaries, and key allocations must be strictly enforced via `isValidStore()` and `isValidReview()`.

## 2. The Dirty Dozen Payloads (Targeting Rejection)
1. **Unauthenticated Store Creation**: Anonymous write to `/stores/fake-store` -> `PERMISSION_DENIED`
2. **Non-Admin Store Modification**: Authenticated standard user attempting to mutate `/stores/goodwill-san-marco` -> `PERMISSION_DENIED`
3. **Ghost Field Injection**: Adding unapproved arbitrary keys like `__shadowKey` to `/stores/{id}` -> `PERMISSION_DENIED`
4. **Junk ID Poisoning**: Storing ID with punctuation or oversized 2KB path -> `PERMISSION_DENIED`
5. **Rating Boundary Violation**: Submitting review rating of `6` or `-1` -> `PERMISSION_DENIED`
6. **Self-Elevated Status**: Public non-admin user submitting review with `status: 'approved'` without validation -> `PERMISSION_DENIED`
7. **Public Deletion of Stores**: Public user calling `deleteDoc` on `/stores/{id}` -> `PERMISSION_DENIED`
8. **Public Deletion of Reviews**: Unauthenticated user calling `deleteDoc` on `/reviews/{id}` -> `PERMISSION_DENIED`
9. **Blanket Admin Impersonation**: Modifying `/admins/{uid}` without being existing verified admin -> `PERMISSION_DENIED`
10. **Malicious Oversized Comment**: Submitting review comment exceeding 2000 chars -> `PERMISSION_DENIED`
11. **Negative Fitting Rooms Count**: Store with `fittingRoomsCount: -5` -> `PERMISSION_DENIED`
12. **Unpublished Store Leak**: Unauthenticated client trying to read store with `published: false` -> `PERMISSION_DENIED`
