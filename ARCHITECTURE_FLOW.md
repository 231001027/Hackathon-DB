# Architecture Flow Diagram

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     REACT UI LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐    ┌──────────────────────┐           │
│  │ TeamLeaderRegister   │    │  StudentDashboard    │           │
│  │  Page                │    │  Page                │           │
│  └──────────────────────┘    └──────────────────────┘           │
│           │                            │                         │
│           └────────────┬───────────────┘                         │
│                        ↓                                         │
│              useAuth() hook                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│              AUTHCONTEXT LAYER                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ AuthContext (State Management)                          │    │
│  │ ├─ registerTeam()                                       │    │
│  │ ├─ registerMemberToTeam()                               │    │
│  │ ├─ uploadPdf()                                          │    │
│  │ ├─ loginStudent()                                       │    │
│  │ └─ loginAdmin()                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│           │                                                       │
│           ├─ Updates localStorage immediately (optimistic UI)   │
│           ├─ Updates local state (teams array)                  │
│           └─ Triggers async Supabase calls                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│           SUPABASE SERVICE LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │ teams.service.ts     │  │ members.service.ts   │             │
│  │ ├─ createTeam()      │  │ ├─ addTeamMember()   │             │
│  │ ├─ getTeamsByLeader()│  │ └─ getTeamMembers()  │             │
│  │ └─ updateTeam()      │  │                      │             │
│  └──────────────────────┘  └──────────────────────┘             │
│                                                                   │
│  ┌──────────────────────────────────────┐                       │
│  │ logging.service.ts                   │                       │
│  │ ├─ logActivity()                     │                       │
│  │ ├─ getActivityLogs()                 │                       │
│  │ └─ getActivityStats()                │                       │
│  └──────────────────────────────────────┘                       │
│                                                                   │
│  All services use: supabase.from('table').insert/select/update   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│          SUPABASE CLIENT (REST API)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  POST   /rest/v1/teams              (Create team)                │
│  POST   /rest/v1/team_members       (Add member)                 │
│  GET    /rest/v1/teams              (Fetch teams)                │
│  POST   /rest/v1/activity_logs      (Log activity)               │
│  GET    /rest/v1/activity_logs      (Get logs)                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│         SUPABASE POSTGRESQL DATABASE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │ teams TABLE          │  │ team_members TABLE   │             │
│  │ ├─ id (PK)          │  │ ├─ id (PK)           │             │
│  │ ├─ teamName         │  │ ├─ team_id (FK)      │             │
│  │ ├─ leaderEmail      │  │ ├─ name              │             │
│  │ ├─ members (JSONB)  │  │ ├─ email             │             │
│  │ ├─ pdfName          │  │ └─ createdAt         │             │
│  │ └─ createdAt        │  │                      │             │
│  └──────────────────────┘  └──────────────────────┘             │
│                                                                   │
│  ┌──────────────────────────────────────┐                       │
│  │ activity_logs TABLE                  │                       │
│  │ ├─ id (PK)                           │                       │
│  │ ├─ action                            │                       │
│  │ ├─ metadata (JSONB)                  │                       │
│  │ └─ createdAt                         │                       │
│  └──────────────────────────────────────┘                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request Flow Example: Team Registration

```
1. User fills form in TeamLeaderRegisterPage
                    ↓
2. User clicks "Register Team"
                    ↓
3. Component calls: registerTeam(payload)
                    ↓
4. AuthContext receives payload
   ├─ Validates team name (no duplicates)
   ├─ Creates local team object
   ├─ Updates UI immediately (localStorage + state)
   ├─ Returns success to component
                    ↓
5. ASYNC: Calls supabase.from('teams').insert([...])
                    ↓
6. Supabase REST API processes request
                    ↓
7. PostgreSQL inserts record into teams table
                    ↓
8. Supabase returns response
                    ↓
9. AuthContext handles response
   ├─ If success: logs activity
   ├─ If error: logs error to activity_logs
                    ↓
10. User sees confirmation on screen
```

---

## Response Flow: Getting Team Data

```
1. Component needs team data
                    ↓
2. Component calls: useAuth() → teams array
                    ↓
3. AuthContext provides cached teams from state
                    ↓
4. Component renders team list immediately
                    ↓
5. (Optional) Service layer fetches fresh data:
   - getTeamsByLeader() → supabase.from('teams').select()
                    ↓
6. Updates state with fresh data (reactive re-render)
```

---

## Architecture Principles

### ✅ **This Flow Is Correct**

Your requirement flowchart:
```
React UI → AuthContext → Supabase Service Layer → Database
```

**Actual Implementation:**
```
React Components (useAuth hook)
        ↓
AuthContext (provides methods)
        ↓
Supabase Client (REST API calls)
        ↓
PostgreSQL Database (stores data)
```

### ✅ **Verified Implementations:**

1. **React → AuthContext**: ✅ All components use `useAuth()`
2. **AuthContext → Services**: ✅ Calls `supabase.from().insert/select`
3. **Services → Database**: ✅ REST API → PostgreSQL
4. **Local State**: ✅ Optimistic UI updates (localStorage + state)
5. **Error Handling**: ✅ Try-catch + Supabase error responses

---

## Key Files

| File | Purpose |
|------|---------|
| `src/context/AuthContext.tsx` | State management hub |
| `src/services/supabase/teams.service.ts` | Team CRUD operations |
| `src/services/supabase/members.service.ts` | Member CRUD operations |
| `src/services/supabase/logging.service.ts` | Activity logging |
| `src/config/supabase.ts` | Supabase client initialization |

---

## Data Flow Summary

```
UI Input → AuthContext (sync) → Supabase API (async) → Database
     ↓                                      ↓
  Local State Update            Network Call (fire-and-forget)
  (Immediate feedback)          (Persistence in background)
```

✅ **Architecture is correct and follows best practices!**
