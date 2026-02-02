# Family FMEA Components Documentation

This document describes each component in the `family-fmea/components` directory. It is intended for junior developers to understand the purpose, usage, and extension points for each component.

---

## 1. cause-card/CauseCard
**File:** cause-card.tsx

**Purpose:**
Renders a single cause card (5M element) with status styling and edit functionality.

**Props:**
- `name`: Display name for the cause.
- `status`: Status value for visual state styling.
- `statusLabel`: Human-readable status label.
- `onClick`: Handler for selecting/toggling the card.
- `onEdit`: Handler for opening the edit flow.

**Usage:**
Use this component to show a cause in a 5M panel. It is clickable and has an edit button. No internal state.

**Extension:**
Add more visual states or actions by extending props and event handlers.

---

## 2. create-item-modal/CreateItemModal
**File:** create-item-modal.tsx

**Purpose:**
Reusable modal for creating or editing process/equipment elements with optional details.

**Props:**
- `open`: Controls modal visibility.
- `title`: Modal header.
- `processNameLabel`: Optional label for process name input.
- `elementNameLabel`: Label for element name input.
- `initialValues`: Prefill values for edit flows.
- `onClose`: Called when user cancels.
- `onSubmit`: Called with creation payload when user saves.

**Usage:**
Use for both creating and editing items. Handles form state and validation.

**Extension:**
Add more fields or validation logic as needed.

---

## 3. equipment-panel/EquipmentPanel
**File:** equipment-panel.tsx

**Purpose:**
Renders the equipment column for a single process, including 5M panel behavior and equipment management.

**Props:**
- `process`: Process owning the equipment entries.
- `isSelected`: Whether the process row is active.
- `clampHeight`: Optional height to clip inactive panels.
- `statusLabel`: Labels for equipment status badges.
- `onAddEquipment`: Callback for adding equipment.
- `onSelectProcess`: Callback for activating a faded panel.
- `onToggleEquipmentStatus`: Callback for status toggles.
- `onEditEquipment`: Callback for editing equipment entries.

**Usage:**
Handles display and interaction for equipment in a process. Uses 5M panel for categorization.

**Extension:**
Add new equipment types or UI features by extending props and handlers.

---

## 4. family-fmea-client/FamilyFmeaClient
**File:** family-fmea-client.tsx

**Purpose:**
Main client component for the Family FMEA feature. Handles data fetching, state, and coordinates the process board and modals.

**Props:**
- `initialFamilyId`: (optional) Initial family ID to load.
- `initialFamilyCode`: (optional) Initial family code to load.

**Usage:**
Entry point for the Family FMEA UI. Manages state, fetches data, and renders the process board and modals.

**Extension:**
Add new flows, modals, or data sources as needed.

---

## 5. five-m-panel/FiveMPanel
**File:** five-m-panel.tsx

**Purpose:**
Renders the 5M panel with a horizontal row of buttons and per-column cause cards.

**Props:**
- `labels`: Button labels for 5M categories.
- `items`: Per-label cause card entries.
- `headerHeight`: Used to set the panel height.
- `statusLabel`: Labels for cause status badges.
- `onAddItem`: Handler for spawning new cause cards.
- `onToggleCauseStatus`: Callback for status toggles.
- `onEditCause`: Callback for editing cause entries.

**Usage:**
Displays and manages 5M categories and their causes. Used inside equipment/process panels.

**Extension:**
Add new categories or actions by extending props and handlers.

---

## 6. process-board/ProcessBoard
**File:** process-board.tsx

**Purpose:**
Renders the main process flow board and delegates equipment UI to the equipment panel.

**Props:**
- `familyCode`: Label for the family rail.
- `processes`: List of processes.
- `selectedProcessId`: Active process id.
- `onSelectProcess`: Callback for selecting a process.
- `onToggleProcessStatus`: Callback for toggling process status.
- `onToggleEquipmentStatus`: Callback for toggling equipment status.
- `onAddProcess`: Opens process creation flow.
- `onAddEquipment`: Opens equipment creation flow.
- `onEditProcessElement`: Opens edit flow for process element card.
- `onEditEquipment`: Opens edit flow for equipment elements.

**Usage:**
Main board for process and equipment management. Handles selection and actions.

**Extension:**
Add new columns, actions, or UI features as needed.

---

## 7. process-characteristics-card/ProcessCharacteristicsCard
**File:** process-characteristics-card.tsx

**Purpose:**
Renders a single process characteristics card with status styling and edit functionality.

**Props:**
- `name`: Display name for the process characteristics.
- `status`: Status value for visual state styling.
- `statusLabel`: Human-readable status label.
- `onClick`: Handler for selecting/toggling the card.
- `onEdit`: Handler for opening the edit flow.

**Usage:**
Use to show process characteristics in the process board. Clickable and editable.

**Extension:**
Add more fields or actions as needed.

---

## 8. product-characteristics-card/ProductCharacteristicsCard
**File:** product-characteristics-card.tsx

**Purpose:**
Renders a single product characteristics card with status styling and edit functionality.

**Props:**
- `name`: Display name for the product characteristics.
- `status`: Status value for visual state styling.
- `statusLabel`: Human-readable status label.
- `onClick`: Handler for selecting/toggling the card.
- `onEdit`: Handler for opening the edit flow.

**Usage:**
Use to show product characteristics in equipment panels. Clickable and editable.

**Extension:**
Add more fields or actions as needed.

---

## General Tips for Further Development
- All components use TypeScript for type safety. Update prop types as you add new features.
- Most components are stateless and rely on parent handlers for actions. Add state only if necessary.
- Use the provided CSS modules for styling. Add new classes as needed.
- Follow the pattern of clear prop documentation and responsibility comments for new components.

---

For questions or improvements, see the code comments in each file or ask a senior developer.
