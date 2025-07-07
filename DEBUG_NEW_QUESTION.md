# Debug Guide: New Question Creation

## Issue Fixed

The issue was that when creating a new question with URL `/new`, the frontend was making unnecessary backend calls, causing the error: "Failed to load question with ID: new"

## Changes Made

### 1. Added Safeguards in CreationService

All backend methods now check for "new" or "temp-" IDs and prevent backend calls:

```typescript
// In creationService.ts methods:
if (id === 'new' || id.startsWith('temp-')) {
  throw new Error('Cannot fetch creation data for new or temporary questions. Use local creation instead.');
}
```

### 2. Enhanced Logging in useCreation Hook

Added extensive logging to track the flow:

```typescript
console.log('🚀 INITIALIZING CREATION - questionId:', questionId, 'questionType:', questionType, 'isNewQuestion:', isNewQuestion);

if (questionId === 'new') {
  console.log('✅ CONFIRMED NEW QUESTION - Will not make backend calls');
}
```

## How to Test

### 1. Open Browser Developer Tools
- Press F12 or right-click -> Inspect
- Go to Console tab

### 2. Navigate to New Question Creation
```
http://localhost:3100/add-problem/create/cfg/new?title=test&description=test&category=Context-Free+Grammar&points=100&estimatedTime=30&author=Teacher+Hosea
```

### 3. Expected Console Output

You should see these logs in sequence:

```
🚀 INITIALIZING CREATION - questionId: new questionType: cfg isNewQuestion: true
✅ CONFIRMED NEW QUESTION - Will not make backend calls  
🆕 NEW QUESTION DETECTED - questionId: new isNewQuestion: true
🆕 CREATING NEW QUESTION - Using temporary ID, no backend call
ℹ️ NO CONTENT TO POPULATE - Starting with empty content
```

### 4. What NOT to See

You should NOT see any of these error logs:
```
❌ Failed to load existing creation
📥 GET CREATION DATA - Fetching question ID: new
Failed to load question with ID: new
Cannot access 'ec' before initialization
```

## Verification Steps

1. **Check Network Tab**: No API calls to `/questions/new` should appear
2. **Check Console**: Should show "NEW QUESTION" logs, not "LOADING EXISTING" logs  
3. **Check Error State**: No error messages should appear in UI
4. **Check Question Instance**: Question should be created with temporary ID starting with "temp-"

## Expected Flow for New Questions

1. **URL Detection**: `questionId === 'new'` → `isNewQuestion = true`
2. **Local Creation**: Create `CreationData` with `temp-${Date.now()}` ID
3. **No Backend Calls**: Skip all `getCreationData()` calls
4. **Temporary State**: Question exists only in frontend until first save
5. **Backend Creation**: Only happens on first `saveDraft()` or `submitCreation()`

## Expected Flow for Existing Questions

1. **URL Detection**: `questionId !== 'new'` → `isNewQuestion = false`  
2. **Backend Fetch**: Call `getCreationData(questionId)`
3. **Content Population**: Load existing content from backend
4. **Edit Mode**: Ready for modifications

## Common Issues & Solutions

### Issue: Still seeing backend calls for "new"
**Solution**: Check that `isNewQuestion` variable is correctly calculated as `questionId === 'new'`

### Issue: "Cannot access 'ec' before initialization" 
**Solution**: This was a React/JavaScript initialization error caused by the backend call failure. Should be resolved now.

### Issue: Question not saving properly
**Solution**: Ensure `markAsChanged()` is called when modifying question content

### Issue: Temporary ID not being replaced
**Solution**: Check that `saveDraft()` returns updated `CreationData` with real ID from backend

## Code Flow Summary

```
URL: /create/cfg/new
    ↓
questionId = "new"
    ↓
isNewQuestion = true
    ↓
if (isNewQuestion) {
  // Create local temporary instance
  // NO backend calls
} else {
  // Load from backend
}
```

This ensures clean separation between new question creation (frontend-only) and existing question editing (backend-loaded). 