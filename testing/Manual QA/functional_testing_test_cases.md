# Manual Test Cases: Functional Testing

Functional test cases for various modules of the News Portal application to ensure features work according to business requirements.

---

## ⚙️ Functional Test Cases Specification

| TC ID & Name | Module | Description | Preconditions | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_FUNC_001**<br>Role-based Access | Authentication | Verify Admin and User roles have different access permissions. | Admin and User exist. | 1. Login as Admin.<br>2. Access Admin Dashboard.<br>3. Login as User.<br>4. Access Admin Dashboard. | Admin accesses dashboard successfully. User gets `403 Forbidden`. | PASS |
| **TC_FUNC_002**<br>Pagination | News Feed | Verify news feed pagination works correctly. | DB has >10 articles. | 1. Fetch `/api/news?page=2&limit=5`. | Returns exactly 5 items from the second page. | PASS |
| **TC_FUNC_003**<br>Comment Submission | Interaction | Verify authenticated users can post comments on articles. | Active JWT. | 1. Submit comment to `/api/comments/:postId`. | Comment saved and displayed under the article. | PASS |
| **TC_FUNC_004**<br>Profile Image Upload | User Profile | Verify user can upload/update a profile avatar. | Active JWT. | 1. Submit image to `/api/auth/avatar`. | Avatar uploaded, URL returned, and profile updated. | PASS |
| **TC_FUNC_005**<br>Password Reset | Authentication | Verify user can reset password using registered email. | User exists. | 1. Request reset link.<br>2. Use link with new password. | Password successfully updated, login works with new password. | PASS |
