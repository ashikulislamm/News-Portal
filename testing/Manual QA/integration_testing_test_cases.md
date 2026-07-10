# Manual Test Cases: Integration Testing

Integration test suite verifying data flow and interaction between different modules (e.g., Auth + News + Comments) and external services.

---

## 🔗 Integration Test Cases Specification

| TC ID & Name | Modules | Description | Preconditions | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_INT_001**<br>Create Post & Fetch Feed | News + DB | Verify a newly created post immediately appears in the news feed. | Active JWT. | 1. Create post.<br>2. Fetch `/api/news`. | New post is present at the top of the fetched feed list. | PASS |
| **TC_INT_002**<br>Delete User & Cascade Data | Auth + News + Comments | Verify deleting a user account cascades to delete their posts and comments. | User has posts/comments. | 1. Delete user.<br>2. Query user's posts.<br>3. Query user's comments. | Posts and comments authored by the deleted user are removed from DB. | PASS |
| **TC_INT_003**<br>Like Post & View Count | Interaction + News | Verify interactions correctly update the aggregate statistics of a post. | Active JWT. | 1. Fetch post (note stats).<br>2. Like post.<br>3. Fetch post again. | Likes count is incremented, View count is incremented. | PASS |
| **TC_INT_004**<br>Category Filter & DB Index | Search + DB | Verify filtering by category utilizes correct DB relations to fetch matching content. | Posts in multiple categories. | 1. Request `/api/news?category=Tech`. | Only 'Tech' category articles are returned. | PASS |
