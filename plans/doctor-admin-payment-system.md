# Plan: Doctor-Admin Payment System

## Goal
Extend the existing payment system to allow admins to create payment requests for doctors, with amount auto-populated from the doctor's consultation fee.

## Key Requirements
1. Admins can create payment requests for any doctor's appointment
2. Payment amount auto-populates from the appointment's doctor's consultation fee
3. Maintain existing doctor/patient payment restrictions
4. Preserve all existing functionality (webhooks, emails, etc.)

## Design Decisions
1. **Role-based access control**: Use existing `is_admin_role` property to identify admins
2. **Serializer modification**: Update `PaymentCreateSerializer` to:
   - Check if requesting user is admin
   - If admin, get doctor from appointment (not request user)
   - Auto-populate amount from doctor's consultation fee
   - Maintain existing validation for non-admin users
4. **No URL/endpoint changes** - reuse existing `/api/v1/payments/` endpoint
5. **Backward compatibility** - existing doctor-created payments unchanged

## Implementation Steps
1. **Modify PaymentCreateSerializer**:
   - Add admin check in `validate_appointment_id`
   - Modify `create()` method to handle admin vs doctor cases
   - Keep existing validation for non-admin users
2. **Verify existing tests pass** with modified logic
3. **Update documentation** in .env.example and any relevant docs

## Risk Mitigation
- **Data integrity**: Ensure payment creation always links to valid appointment
- **Security**: Admins can only create payments for existing appointments with valid doctors
- **Consistency**: Amount calculation remains uniform (doctor's consultation fee)
- **Testing**: Existing test suite covers all scenarios

## Open Questions (Resolved)
- ✅ Admin payment creation permission - YES (confirmed)
- ✅ Payment amount source - YES (auto-populate from consultation fee)

## Validation Plan
1. Run existing test suite to ensure no regressions
2. Add new test cases for admin payment creation
3. Verify webhook functionality still works
4. Confirm email notifications fire correctly

## Task List
- [x] Modify PaymentCreateSerializer to handle admin payments
- [x] Ensure amount auto-populates from doctor's consultation fee
- [x] Maintain existing validation for non-admin users
- [x] Verify all existing tests pass
- [x] Confirm admin can create payments for any doctor