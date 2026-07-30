# Dashboard Performance & UX Fixes

## Plan
1. **Remove full-page spinner** - Replace with section-level loading states
2. **Parallel data fetching** - Use Promise.allSettled so sections render independently  
3. **Skeleton loaders** - Add shimmer animation for each section while loading
4. **Progressive rendering** - Show each widget/card as soon as its data arrives

## Steps
- [x] Fix `useAuth` import from `hooks` to `context/AuthContext`
- [ ] Rewrite data fetching to use parallel Promise.allSettled pattern
- [ ] Add individual loading states per section
- [ ] Add skeleton shimmer components for each widget
- [ ] Remove the full-page `if (loading)` spinner block
- [ ] Each section renders skeleton until its data loads

