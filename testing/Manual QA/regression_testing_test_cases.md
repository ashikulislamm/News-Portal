# Manual Test Cases: Regression Testing

This document contains test cases to ensure that recent code changes, bug fixes, or enhancements have not adversely affected existing functionalities in the News Portal application.

---

## 🔄 Regression Test Cases Specification

| TC ID & Name | Target Area | Description | Preconditions | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_REG_001**<br>JWT Expiration | Authentication | Verify token expiration still works after Auth module refactoring. | Expired JWT token. | 1. Use expired token on protected route. | `401 Unauthorized` is returned with `Token Expired` message. | PASS |
| **TC_REG_002**<br>Slug Uniqueness | News Content | Verify post slugs remain unique even when identical titles are submitted. | Post with title "New Test" exists. | 1. Create another post with title "New Test". | New slug is generated with suffix (e.g., `new-test-1`), no DB conflict error. | PASS |
| **TC_REG_003**<br>XSS Prevention | Security | Verify that rich text editor content is still sanitized after UI updates. | Active JWT. | 1. Submit post with `<script>alert('XSS')</script>` in content. | Script tags are stripped or escaped before saving/rendering. | PASS |
| **TC_REG_004**<br>Image Optimization | Media | Verify that uploaded images are still compressed and resized correctly. | Active JWT. | 1. Upload large image (5MB). | Image saved successfully, size reduced, format converted to WebP/optimized. | PASS |
| **TC_REG_005**<br>Old App Version Compatibility | API | Verify older clients without newer headers still receive valid backward-compatible responses. | None | 1. Send requests simulating old client (no specific version header). | API responds correctly without breaking the client. | PASS |
