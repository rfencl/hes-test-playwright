# hes-test-playwright
<img width="993" height="438" alt="image" src="https://github.com/user-attachments/assets/ee6c91bb-e90b-4374-aace-696621eb0ff3" />


This is the Playwright implementaion of the hes-interview coding assignment.
The tests assume that the User and Household are already present.
Run these in DBeaver if the database has just been started.
``` sql
"INSERT INTO public.\"Household\" " +
              "(id, \"homeType\", \"ownership\", \"lienholderId\", address1, address2, city, \"state\", zip) " +
              "VALUES(1, 'HOUSE'::public.\"HomeType\", 'MORTGAGE'::public.\"Ownership\", NULL, '1111 Main St.', '', 'Somewhere', 'CA'::public.\"State\", '90210')";

"INSERT INTO public.\"User\" " +
              "(id, \"name\", email, image, \"password\", \"role\", \"householdId\", \"isTwoFactorEnabled\") " +
              "VALUES(1, 'Fake Edwards', 'fake.edwards2@example.com', '/images/11.avif', '$2a$10$duFK2o1COHpWVrCXMV/xJOF8dzgJOt.sPXKVRFqNESOQ3Pr0AH6P6', 'USER'::public.\"UserRole\", 1, false)";
```
## Key Features 
1. Auth setup is run separately and the session data is stored in playwright\.auth\user.json

## Test Criteria
1. Add new person record to household.
2. Verify that the API returns the person record just added.
3. Verify that the person record is in the database.
4. Delete the newly added person record via the UI, verify that the record is removed from the database.

