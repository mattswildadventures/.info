# Mac-Style Portfolio Transformation Instructions

## Objective
Transform the existing Windows-style portfolio website to use Mac-style visual design language while maintaining all existing functionality and layout structure.

## Design Specifications

### Mac Traffic Light Buttons
- **Position**: Top-left corner of windows/modals
- **Colors**: 
  - Close: `#FF5F57` (red)
  - Minimize: `#FFBD2E` (yellow) 
  - Maximize: `#28CA42` (green)
- **Style**: Perfect circles, 12px diameter
- **Spacing**: 8px from left edge, 6px between buttons
- **Hover states**: Slightly darker versions of base colors
- **Layout**: Horizontal row, red-yellow-green from left to right

### Corner Rounding
- **Window frames**: 12px border-radius
- **Cards/tiles**: 8px border-radius
- **Buttons**: 6px border-radius
- **Input fields**: 4px border-radius
- **Small elements**: 3px border-radius

### Shadow and Depth
- **Window shadows**: Softer, more diffused shadows typical of macOS
- **Card shadows**: Subtle elevation with softer edges
- **Remove**: Any sharp, harsh shadows

## Task List

### Phase 1: Window Controls
- [ ] Locate all window control elements (currently red X and green buttons in top-right)
- [ ] Replace with Mac traffic light button component
- [ ] Reposition from top-right to top-left
- [ ] Update styling to match Mac specifications above
- [ ] Ensure proper hover and click interactions
- [ ] Test functionality remains intact

### Phase 2: Border Radius Updates
- [ ] Apply 12px border-radius to main window/modal containers
- [ ] Apply 8px border-radius to all dashboard tiles (About Me, My Work, Skills, Blog)
- [ ] Apply 8px border-radius to content cards and panels
- [ ] Apply 6px border-radius to interactive buttons
- [ ] Apply 4px border-radius to any input fields or form elements
- [ ] Apply 3px border-radius to small UI elements (icons, badges, etc.)

### Phase 3: Shadow Refinements
- [ ] Identify all current box-shadow properties
- [ ] Replace sharp shadows with softer, more diffused Mac-style shadows
- [ ] Adjust shadow blur radius and offset for more organic feel
- [ ] Ensure shadows don't appear harsh or Windows-like
- [ ] Test shadow appearance on different backgrounds

### Phase 4: Spacing and Layout Adjustments
- [ ] Adjust window chrome spacing to accommodate traffic light buttons
- [ ] Ensure adequate padding around rounded corners
- [ ] Verify all text and content doesn't get cut off by new rounded corners
- [ ] Check that click areas remain accessible with new button positions

### Phase 5: Testing and Refinement
- [ ] Test all interactive elements function correctly
- [ ] Verify responsive design still works across screen sizes
- [ ] Check accessibility features (reduce motion, etc.) still function
- [ ] Ensure color contrast ratios remain acceptable
- [ ] Test on different browsers for consistency
- [ ] Verify social media links and navigation still work

## Specific Elements to Update

### Main Dashboard
- [ ] Four main tiles (About Me, My Work, Skills, Blog)
- [ ] Background container
- [ ] Any overlay or modal windows

### About Me Section
- [ ] Main content window
- [ ] Profile image container
- [ ] Resume and Email buttons
- [ ] Window controls

### My Work Section
- [ ] Main content window
- [ ] Folder/category containers
- [ ] Project detail views
- [ ] Window controls

### Skills Section
- [ ] Main content window
- [ ] Tab containers (Fundamentals, Libraries/Frameworks, Tools, Misc)
- [ ] Technology icon containers
- [ ] Window controls

### Global Elements
- [ ] Settings/preferences window
- [ ] Any tooltip or popup elements
- [ ] Navigation elements
- [ ] Footer components

## Acceptance Criteria

### Visual
- [ ] All windows use Mac-style traffic light buttons in top-left
- [ ] All UI elements have appropriate rounded corners
- [ ] Shadows appear soft and Mac-like, not sharp or Windows-like
- [ ] Overall aesthetic feels cohesive with macOS design language

### Functional
- [ ] All existing functionality preserved
- [ ] Window controls work as expected
- [ ] Responsive design maintained
- [ ] Accessibility features intact
- [ ] Cross-browser compatibility preserved

### Code Quality
- [ ] CSS changes are clean and maintainable
- [ ] No duplicate or conflicting styles
- [ ] Proper use of CSS custom properties where applicable
- [ ] Comments added for major changes

## Notes
- Maintain all existing color schemes except for window controls
- Preserve all animations and transitions, just update styling
- Keep the teal background and navy card colors
- Do not modify any JavaScript functionality
- Focus only on visual/CSS changes