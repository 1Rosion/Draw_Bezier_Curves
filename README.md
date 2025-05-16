# Bézier Curve Designer

**Transform graphical Bézier curves into JavaScript code with ease!**  
This project provides an interactive tool for drawing Bézier curves and exporting their data as JavaScript functions.

---

## Features

- Interactive Bézier curve drawing with adjustable control points.
- Real-time preview of the curve.
- Export Bézier curve data as JavaScript code for integration into your projects.
- Simple and intuitive user interface.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/1Rosion/Draw_Bezier_Curves.git
   ```

2. Navigate to the project directory:
   ```bash
   cd bezier-curve-designer
   ```

3. Open `index.html` in your browser:
   - No dependencies required; it's a fully standalone tool!
### OR use this link **https://1rosion.github.io/Draw_Bezier_Curves/** 
---

## Usage

1. Open the application in your browser.
2. Use the interactive canvas to draw Bézier curves:
   - Drag the control points to shape the curve.
3. Click the **"Show JS conversion"** button to see JavaScript code.
4. Copy and paste the exported code into your project.

---

## Example

### **Generated JavaScript Code:**

Here's an example of the exported output:

```javascript
    ctx.beginPath();
    ctx.moveTo(50, 200);
    ctx.bezierCurveTo(150, 100, 250, 300, 350, 200);
    ctx.stroke();
```

Use this function in your canvas-based projects to render the Bézier curve!

---

## Contributing

Contributions are welcome!  
If you'd like to add new features or fix issues, please follow these steps:

1. Fork this repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).  
Feel free to use, modify, and share, as long as the license terms are respected.

---

## Contact

For questions or suggestions, feel free to reach out:

- **Email:** rosion282@gmail.com
