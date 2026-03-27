# PRODUCT REQUIREMENTS DOCUMENT (PRD)

```
Product Name: HizbHub
Type: SaaS Platform
Version: MVP → V1
```

***

# 1.  Product Overview

**HizbHub** is a modern SaaS platform that enables creators to:

* build online communities
* create and sell courses
* monetize their audience

All in one place.

It acts as a **central hub** where:

* communities live
* discussions happen
* courses are delivered
* monetization is managed

***

## &#x20;Vision

To become the **all-in-one platform for creators** to build, grow, and monetize their communities and knowledge.

## Mission

Simplify:

* community building
* content delivery
* monetization

so creators can focus on **value, not tools**.

***

# 2.  Target Users

***

## Primary Users (Creators)

People who want to:

* build communities
* teach or share knowledge
* monetize via memberships and courses

Examples:

* educators
* coaches
* niche experts
* creators

***

## Secondary Users (Members / Students)

People who:

* join communities
* consume content
* enroll in courses
* interact with others

***

# 3.  Core Problem

Creators today use multiple tools:

* Discord / Telegram → community
* Gumroad / Teachable → courses
* Patreon → monetization

Problems:

* fragmented experience
* poor integration
* difficult management

***

## ✅ Solution

HizbHub combines:

* community
* courses
* monetization

into a **single unified platform**.

***

# 4.  Core Features (MVP)

***

## &#x20;Authentication

* Sign up / Login (Clerk)
* User profile

***

## 🏠 Community System

### Creators can:

* create communities
* manage settings
* create channels

### Members can:

* join / leave communities
* interact with content

***

## 💬 Posts & Interaction

* create posts
* comment
* basic engagement

***

## 📂 Channels

* announcements
* general
* custom channels

***

## 🎓 Course System (CORE FEATURE)

This is a **main monetization system**.

***

### Creators can:

* create courses
* create folders (sections)
* create pages (lessons)
* write structured content
* organize course hierarchy

***

### Course Structure

```txt
Course 
  ├── Folder (Module) 
  │    ├── Page (Lesson) 
  │    ├── Page │ 
  ├── Folder 
  │    ├── Page
```

***

### Course Capabilities

* free courses
* paid courses
* structured learning
* text-based content (MVP)

***

### Members can:

* enroll in courses
* access lessons
* learn inside the platform

***

## 💳 Monetization (Dual System)

HizbHub supports **two monetization methods**:

***

### 1. Community Monetization

* paid communities
* subscription access

***

### 2. Course Monetization

* paid courses
* one-time payments

***

### Payment Integration

* telebirr integration
* payment verification
* access control after payment

***

## 📊 Creator Dashboard

Creators can:

* manage communities
* manage courses
* manage members (basic)
* view content

***

# 5.  User Flow

***

## 👤 Creator Flow

```
1. User signs up
2. Completes onboarding
3. Creates a community
4. Creates channels
5. Creates course (optional)
6. Adds lessons
7. Sets pricing (community or course)
8. Publishes
9. Invites members
```

***

## 👥 Member / Student Flow

```
1. User signs up
2. Joins a community
3. Reads posts and interacts
4. Enrolls in a course (free or paid)
5. Consumes lessons
6. Participates in discussions
```

***

# 6. 💰 Monetization Model

***

## Platform Revenue

HizbHub earns via:

* subscription plans (SaaS)
* (future) transaction fees

***

## Creator Revenue

Creators earn via:

### 1. Paid Communities

* monthly / yearly subscriptions

### 2. Paid Courses

* one-time payments

***

## Key Insight

> Communities build **recurring revenue**
> Courses generate **upfront revenue**

HizbHub enables both.

***

# 7. 🏗️ Technical Stack

### Frontend

* Next.js
* TailwindCSS With shadcn

### Backend

* Next.js API / server actions with oRPC

### Auth

* Clerk

### Database

* Neon database

### Payments

* telebirr

### Hosting

* For now Vercel later i might change in to netlify&#x20;

***

# 8.  UX Principles

* simple creation flow
* structured learning experience
* minimal friction
* clear navigation (community vs courses)

***

# 9.  Non-Goals (MVP)

* video hosting (initially optional)
* advanced analytics
* certificates
* quizzes
* add resource section to the community

👉 Focus on **core value first**

***

# 10. 📈 Success Metrics

***

## Community Metrics

* communities created
* posts per community
* engagement rate

***

## Course Metrics

* courses created
* course enrollments
* course completion (future)

***

## Revenue Metrics

* paid communities
* paid course purchases
* total creator earnings

***

# 11.  Roadmap

***

## Phase 1 (Now)

* communities
* posts
* basic monetization
* course system (MVP)

***

## Phase 2

* better course UX
* notifications
* engagement improvements

***

## Phase 3

* analytics dashboard
* advanced monetization
* creator growth tools

***

# 12. ⚠️ Risks

***

### 1. Too Many Features

Community + courses \= complexity

👉 Solution:

* keep UI simple
* guide users

***

### 2. Empty Courses

Creators don’t create content

👉 Solution:

* provide templates (like you did)

***

### 3. Low Conversion

Users don’t pay

👉 Solution:

* strong education (HizbHub + Plus)
* clear value

***

# 13.  Competitive Positioning

Competitors:

* Circle → community
* Teachable → courses
* Patreon → monetization

***

## HizbHub Advantage

> All-in-one system:

* community
* courses
* monetization

No need for multiple tools.

***

# 14. Core Product Insight

> The strongest creator businesses combine:**content + community + monetization**

HizbHub enables all three.

***

# 15.  Definition of Done (MVP)

```
✔ User can create community
✔ User can create posts
✔ User can join community
✔ User can create course
✔ Course has folders and pages
✔ User can enroll in course
✔ Paid community works
✔ Paid course works
✔ Platform is deployable
✔ First users can use without confusion
```
