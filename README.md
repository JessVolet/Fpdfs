# EduDraft Pro - Theme System Guide

EduDraft Pro allows you to completely customize the appearance of your documents using the Theme System. You can define styles for the **Cover**, **Content**, and **Final** pages.

## Theme File Structure (.json)

Themes are simple JSON files that define layers for different page types.

```json
{
  "id": "unique-theme-id",
  "name": "My Custom Theme",
  "layers": {
    "cover": {
      "containerClass": "bg-slate-900 text-white",
      "style": { "backgroundColor": "#0f172a" },
      "elements": [
        { 
          "className": "absolute top-0 left-0 w-full h-32 bg-indigo-500",
          "style": { "opacity": 0.5 }
        }
      ]
    },
    "content": {
      "containerClass": "bg-white text-slate-800",
      "elements": []
    },
    "final": {
      "containerClass": "bg-slate-900 text-white flex flex-col items-center justify-center p-20",
      "elements": []
    }
  }
}
```

## How to Import a Theme
1.  Go to the **Themes** tab in the sidebar.
2.  Click **Select File** under "Import Theme".
3.  Choose your `.json` file.
4.  The theme will appear in your Library and can be selected in the "Active Configuration" section.

## Styling Guidelines
-   **Dimensions**: The document uses **Letter size** (8.5in x 11in).
-   **CSS Classes**: You can use tailwind classes in `containerClass` and `elements[].className`.
-   **Inline Styles**: Use the `style` object for custom CSS properties (e.g., gradients, specific colors).
-   **Geometric Shapes**: Add objects to the `elements` array. Use `absolute` positioning to place them relative to the page.

## Important Notes on Printing
-   **Backgrounds**: Ensure your browser's print settings have "Background Graphics" enabled.
-   **Margins**: The system is designed for borderless printing (`margin: 0` in CSS). Ensure your printer settings match this or scale to fit.
