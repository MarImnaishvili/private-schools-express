---
description: Create a UI Component in / components/ui
argument-hint: Component name | Component summary
---

## Context

Parse $ARGUMENTS to get the following values:

- [name]: Component name from $ARGUMENTS, converted to PascalCase
- [summary]: Component summary from $ARGUMENTS

## Task

Make a UI component according to the [name] and [summary] provided, following these guidelines:

- Create the component file in `src/components/ui/[name]/[name].tsx`
- Use a functional component with the name [name]
- Reference the [summary] when making the component

## Variants

- Add the following variants for the component using the colours from the theme variables in the @src\app\globals.css file:

1. primary
2. secondary
3. success
4. danger
5. warning

- Support common patterns like disabled states and sizes where appropriate (sm, md, lg, defaulting to md when no preference is passed).

## Testing

- Make a test file for the component to test basic use cases
- Use @src\components\ui\Button\Button.test.tsx as a reference to make the test file for the new component.
- Run tests and iterate until they all pass.

## Previews

- Add the component to the `src/app/preview/page.tsx` file so it can be viewed in the browser, and use multiple variants.
- Do NOT add the component to any other page.
